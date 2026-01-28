import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import { PRIVATE_API } from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Navbar needs these props
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await PRIVATE_API.get("/api/orders/my/");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load orders ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getOrderTotal = (order) => {
    return order.items.reduce(
      (sum, it) => sum + it.price_at_order_time * it.quantity,
      0
    );
  };

  return (
    <div>
      <StudentNavbar search={search} setSearch={setSearch} />

      <div className="max-w-[1600px] mx-auto px-10 py-8">
        <h1 className="text-4xl font-bold mb-8">My Orders 📦</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold">Order #{order.id}</h2>

                    <p className="text-gray-700 mt-1">
                      Stall:{" "}
                      <span className="font-semibold">{order.stall_name}</span>
                    </p>

                    <p className="text-gray-700">
                      Status:{" "}
                      <span className="font-semibold">{order.status}</span>
                    </p>

                    <p className="text-gray-700">
                      Total:{" "}
                      <span className="font-semibold">
                        ₹{getOrderTotal(order)}
                      </span>
                    </p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {order.created_at ? (
                      <p>{new Date(order.created_at).toLocaleString()}</p>
                    ) : null}
                  </div>
                </div>

                {/* Items */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Items</h3>

                  <div className="space-y-2">
                    {order.items.map((it, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-gray-200 rounded-xl p-3"
                      >
                        <div>
                          <p className="font-semibold">{it.menu_item_name}</p>
                          <p className="text-sm text-gray-600">
                            ₹{it.price_at_order_time} × {it.quantity}
                          </p>
                        </div>

                        <p className="font-bold">
                          ₹{it.price_at_order_time * it.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
