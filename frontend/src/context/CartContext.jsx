import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [stallId, setStallId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // ✅ Add item (and enforce one stall per cart)
  const addToCart = (item, currentStallId) => {
    setCartItems((prev) => {
      // If cart is empty -> set stallId
      if (!stallId) {
        setStallId(currentStallId);
      }

      // If cart already has stallId but different stall -> block
      if (stallId && stallId !== currentStallId) {
        alert("You can order from only one stall at a time ❌");
        return prev;
      }

      // If item already exists -> qty +1
      const exists = prev.find((x) => x.id === item.id);

      if (exists) {
        return prev.map((x) =>
          x.id === item.id ? { ...x, qty: x.qty + 1 } : x
        );
      }

      // else add new item with qty = 1
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((x) => x.id !== id));
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setStallId(null);
  };

  // ✅ Total items count (for navbar badge later)
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        stallId,
        cartItems,
        totalItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
