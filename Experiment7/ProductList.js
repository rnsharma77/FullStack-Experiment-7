import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]); // store fetched data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error handling

  useEffect(() => {
    // Fetch data when component mounts
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>🛍️ Product List</h2>
      <ul style={styles.list}>
        {products.map((p) => (
          <li key={p.id} style={styles.item}>
            <span style={styles.name}>{p.name}</span>
            <span style={styles.price}>₹{p.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Simple inline CSS styles
const styles = {
  container: {
    width: "60%",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
  },
  name: { fontWeight: "bold" },
  price: { color: "green" },
};

export default ProductList;
