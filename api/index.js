const express = require("express");
const cors = require("cors");
const supabase = require("../lib/supabase.js");

const app = express();

app.use(cors());
app.use(express.json());

// GET wishes
app.get("/api", async (req, res) => {
  const { invitationId } = req.query;
    console.log(invitationId);
  if (!invitationId) {
    return res.status(400).json({ error: "invitationId required" });
  }

  
  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .eq("invitation_id", invitationId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// POST wish
app.post("/api", async (req, res) => {
  const { invitationId, name, message, attendance,giphyId} = req.body;


  if (!invitationId || !name || !message) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const { error } = await supabase.from("wishes").insert({
    invitation_id: invitationId,
    name,
    message,
    attendance,
    giphy_id:giphyId
  });

  console.log(error);


  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
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
