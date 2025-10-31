const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // allow requests from frontend
app.use(express.json());

// ===== Dummy product data =====
const products = [
  { id: 1, name: "Laptop", price: 60000 },
  { id: 2, name: "Headphones", price: 2000 },
  { id: 3, name: "Smartphone", price: 30000 },
  { id: 4, name: "Keyboard", price: 1500 },
];

// ===== API route =====
app.get("/api/products", (req, res) => {
  res.json(products);
});

// ===== Start server =====
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
