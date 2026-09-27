import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/claim", (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name and phone number are required.",
    });
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid 10-digit Indian phone number.",
    });
  }

  const claimCode = `MORROW-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;

  return res.json({
    success: true,
    claimCode,
    message: "Your offer has been claimed.",
  });
});

app.listen(PORT, () => {
  console.log(`Morrow API running on http://localhost:${PORT}`);
});