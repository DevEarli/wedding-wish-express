const express = require("express");
const cors = require("cors");
const supabase = require("../lib/supabase.js");

const port = 5000
const app = express();
app.use(cors());
app.use(express.json());

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

// POST wish
app.post("/api/wishes", async (req, res) => {
  const { applicationId, guestId, message, attendance } = req.body;
  if (!applicationId || !guestId || !message) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const { error } = await supabase.from("wishes").upsert({
    id: crypto.randomUUID(),
    application_id: applicationId,
    guest_id: guestId,
    message,
    attendance,
  }, {
    onConflict: "guest_id"
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
