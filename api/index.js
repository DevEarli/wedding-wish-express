const express = require("express");
const cors = require("cors");
const supabase = require("../lib/supabase.js");
const rateLimit = require("express-rate-limit");



const port = 5000
const app = express();
app.use(cors());
app.use(express.json());


// POST wish
const wishLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: 100, // max 100 request
  keyGenerator: (req) => req.body.guestId,
  handler: (req, res) => {
    const now = Date.now();
    const resetTime = req.rateLimit.resetTime.getTime();
    const diff = Math.ceil((resetTime - now) / 1000);

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    res.status(429).json({
      error: `Rate limit exceeded. Try again in ${minutes}m ${seconds}s.`
    });
  }
});

// GET wishes
app.get("/api/wishes", async (req, res) => {
  const { applicationId } = req.query;
  if (!applicationId) {
    return res.status(400).json({ error: "applicationId required" });
  }
  const { data, error } = await supabase
    .from("wishes")
    .select(`
      *,
      guests (
        guest_name,
        partner_name
      )
    `)
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});


app.get("/api/wishes/attendance", async (req, res) => {
  const { applicationId } = req.query;

  const { data, error } = await supabase.rpc('get_enum_attendance', { application_id: applicationId });
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});




app.post("/api/wishes", wishLimiter,async (req, res) => {
  const { applicationId, guestId, message, attendance } = req.body;
  if (!applicationId || !guestId || !message) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  
  const timestamp = new Date().toISOString();
  const { error } = await supabase.from("wishes").upsert({
    id: crypto.randomUUID(),
    application_id: applicationId,
    guest_id: guestId,
    message,
    attendance,
    created_at: timestamp,
    updated_at: timestamp,
  }, {
    onConflict: "guest_id",
  });
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ success: true });
});

app.get("/api/guest", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "id required" });
  }
  const { data, error } = await supabase
    .from("guests")
    .select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/guests", async (req, res) => {

  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});


app.listen(port, () => {
  console.log("Listening on Port " + port);
});
