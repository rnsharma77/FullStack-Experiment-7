import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../features/cartSlice";

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, e) => {
    const qty = parseInt(e.target.value);
    dispatch(updateQuantity({ id, quantity: qty }));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div style={styles.container}>
      <h2>🧺 Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <>
          <ul style={styles.list}>
            {items.map((item) => (
              <li key={item.id} style={styles.item}>
                <div>
                  <strong>{item.name}</strong> — ₹{item.price}
                </div>
                <div>
                  Qty:
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.id, e)}
                    style={styles.input}
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={styles.button}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total: ₹{total}</h3>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "50%",
    margin: "auto",
    padding: "20px",
    borderTop: "2px solid #ddd",
  },
  list: { listStyleType: "none", padding: 0 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    background: "#f1f1f1",
    padding: "10px",
    borderRadius: "8px",
  },
  input: { width: "50px", margin: "0 10px" },
  button: {
    background: "red",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Cart;
