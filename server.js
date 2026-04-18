const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

const filePath = path.join(__dirname, "data/threats.json");

// Read data
const getData = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// 🔍 SEARCH + FILTER
app.get("/api/threats/search", (req, res) => {
  const { keyword = "", category = "", severity = "" } = req.query;

  let data = getData();

  let results = data.filter(item =>
    item.keyword.toLowerCase().includes(keyword.toLowerCase()) &&
    item.category.toLowerCase().includes(category.toLowerCase()) &&
    item.severity.toLowerCase().includes(severity.toLowerCase())
  );

  res.json(results);
});

// 📄 GET ALL
app.get("/api/threats", (req, res) => {
  res.json(getData());
});

app.listen(5000, () => {
  console.log("🔥 Server running on port 5000");
});
app.use(express.json());

// ➕ ADD THREAT
app.post("/api/threats", (req, res) => {
  const newThreat = req.body;

  const data = getData();

  newThreat.id = data.length + 1;

  data.push(newThreat);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: "Threat added successfully" });
});