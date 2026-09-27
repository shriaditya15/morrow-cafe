import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3001;

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ===============================
// API
// ===============================

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

// ===============================
// FRONTEND
// ===============================

// Serve React/Vite production build
app.use(express.static(path.join(__dirname, "dist")));

// Send index.html for frontend routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Morrow API running on port ${PORT}`);
});