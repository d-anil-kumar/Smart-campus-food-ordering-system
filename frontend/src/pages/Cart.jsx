import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { PRIVATE_API } from "../api/axios";
import StudentNavbar from "../components/StudentNavbar";
import { useState } from "react";

export default function Cart() {
  const navigate = useNavigate();

  // navbar needs these props
  const [search, setSearch] = useState("");

  const {
    stallId,
    cartItems,
    totalItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
  } = useCart();

  const [placing, setPlacing] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handlePlaceOrder = async () => {
    if (!stallId || cartItems.length === 0) {
      alert("Cart is empty ❌");
      return;
    }

    const payload = {
      stall_id: stallId,
      items: cartItems.map((item) => ({
        menu_item_id: item.id,
        quantity: item.qty,
      })),
    };

    try {
      setPlacing(true);

      const res = await PRIVATE_API.post("/api/orders/", payload);

      alert(
        `${res.data.message} ✅\nOrder ID: ${res.data.order_id}\nTotal: ₹${res.data.total_price}`
      );

      clearCart();
      navigate("/student/orders");
    } catch (err) {
      console.log(err);
      alert("Failed to place order ❌");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div>
      <StudentNavbar search={search} setSearch={setSearch} />

      <div className="max-w-[1600px] mx-auto px-10 py-8">
        <h1 className="text-4xl font-bold mb-8">
          Cart 🛒 ({totalItems} items)
        </h1>

        {cartItems.length === 0 ? (
          <div>
            <p>Your cart is empty.</p>
            <button
              onClick={() => navigate("/student/stalls")}
              className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg"
            >
              Browse Stalls
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-2xl p-6 flex items-center justify-between"
              >
                <div>
                  <h2 className="text-2xl font-bold">{item.name}</h2>
                  <p className="text-gray-600">₹{item.price}</p>
                  <p className="mt-2 font-semibold">
                    Item Total: ₹{item.price * item.qty}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-4 py-2 bg-gray-200 rounded-lg font-bold"
                  >
                    -
                  </button>

                  <span className="text-xl font-bold">{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-4 py-2 bg-gray-200 rounded-lg font-bold"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="bg-white border rounded-2xl p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Total: ₹{totalPrice}</h2>

              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="px-6 py-3 bg-gray-200 rounded-lg font-semibold"
                >
                  Clear Cart
                </button>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {placing ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
