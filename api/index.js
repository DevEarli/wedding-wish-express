const express = require("express");
const cors = require("cors");
const supabase = require("../lib/supabase.js");
const rateLimit = require("express-rate-limit");



const app = express();

app.use(cors());
app.use(express.json());

// GET wishes
app.get("/api/wishes", async (req, res) => {
  const { applicationId } = req.query;
  console.log(applicationId);
  if (!applicationId) {
    return res.status(400).json({ error: "applicationId required" });
  }

  
  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});



app.post("/api/wishes", async (req, res) => {
  const { applicationId, guestId, message, attendance } = req.body;
  console.log(req.body);

  if (!applicationId || !guestId || !message || !attendance) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const { error } = await supabase.from("wishes").upsert({
    id: crypto.randomUUID(),
    application_id: applicationId,
    guest_id: guestId,
    message,
    attendance,
  }, {
    onConflict: "guest_id",
  });


  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
});

app.get("/api/guests", async (req, res) => {
  const { applicationId } = req.query;

  if (!applicationId) {
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
// app.listen(5000,() => {
//     console.log("runn");
// });

// ❗ PENTING: export app (bukan listen)
// export default app;

app.listen(5000,() => {
  console.log("listennnn");
});
// module.exports = app;/


// export default function handler(req, res) {
//   res.status(200).json({
//     method: req.method,
//     message: "wishes api works"
//   });
// }
