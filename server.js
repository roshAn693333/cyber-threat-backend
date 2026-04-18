const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// ✅ MIDDLEWARE (must come first)
app.use(cors());
app.use(express.json());

// 📁 FILE PATH
const filePath = path.join(__dirname, "data/threats.json");

// 📖 READ DATA
const getData = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// 💾 WRITE DATA
const saveData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// 🏠 ROOT ROUTE (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Cyber Threat Radar Backend is running 🚀");
});

// 🔍 SEARCH + FILTER
app.get("/api/threats/search", (req, res) => {
  try {
    const { keyword = "", category = "", severity = "" } = req.query;

    let data = getData();

    let results = data.filter((item) =>
      item.keyword.toLowerCase().includes(keyword.toLowerCase()) &&
      item.category.toLowerCase().includes(category.toLowerCase()) &&
      item.severity.toLowerCase().includes(severity.toLowerCase())
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Error filtering data" });
  }
});

// 📄 GET ALL
app.get("/api/threats", (req, res) => {
  try {
    res.json(getData());
  } catch (err) {
    res.status(500).json({ error: "Error reading data" });
  }
});

// ➕ ADD THREAT
app.post("/api/threats", (req, res) => {
  try {
    const newThreat = req.body;

    const data = getData();

    newThreat.id = data.length + 1;

    data.push(newThreat);

    saveData(data);

    res.json({ message: "Threat added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error adding threat" });
  }
});

// ✅ PORT FIX (VERY IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🔥 Server running on port " + PORT);
});