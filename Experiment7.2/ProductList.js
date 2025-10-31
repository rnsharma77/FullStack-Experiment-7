import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";

const products = [
  { id: 1, name: "Laptop", price: 60000 },
  { id: 2, name: "Headphones", price: 2000 },
  { id: 3, name: "Smartphone", price: 30000 },
  { id: 4, name: "Keyboard", price: 1500 },
];

const ProductList = () => {
  const dispatch = useDispatch();

  const handleAdd = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div style={styles.container}>
      <h2>🛒 Products</h2>
      <ul style={styles.list}>
        {products.map((p) => (
          <li key={p.id} style={styles.item}>
            <div>
              <strong>{p.name}</strong> — ₹{p.price}
            </div>
            <button onClick={() => handleAdd(p)} style={styles.button}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { width: "50%", margin: "auto", padding: "20px" },
  list: { listStyleType: "none", padding: 0 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    background: "#f8f8f8",
    padding: "10px",
    borderRadius: "8px",
  },
  button: {
    background: "green",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ProductList;
