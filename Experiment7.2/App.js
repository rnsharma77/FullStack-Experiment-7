import React from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px" }}>
        🛍️ Redux Toolkit Shopping Cart
      </h1>
      <ProductList />
      <Cart />
    </div>
  );
}

export default App;
