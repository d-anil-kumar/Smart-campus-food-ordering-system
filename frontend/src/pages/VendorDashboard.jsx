import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VendorNavbar from "../components/VendorNavbar";
import { PRIVATE_API } from "../api/axios";

export default function VendorDashboard() {
  const navigate = useNavigate();

  const [stall, setStall] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [hasNoStall, setHasNoStall] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const fetchMyStall = async () => {
    try {
      const res = await PRIVATE_API.get("/api/stalls/my/");
      setStall(res.data);
      setHasNoStall(false);
      return res.data;
    } catch (err) {
      if (
        err?.response?.status === 404 &&
        err?.response?.data?.detail === "Stall not found for this vendor"
      ) {
        setHasNoStall(true);
      } else {
        console.log(err);
        alert("Failed to load vendor dashboard ❌");
      }
      return null;
    }
  };

  const fetchVendorOrders = async () => {
    try {
      const res = await PRIVATE_API.get("/api/orders/vendor/"); 
      setVendorOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchVendorMenuItems = async () => {
    try {
      const res = await PRIVATE_API.get("/api/stalls/menu/");
      setMenuItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);

    const myStall = await fetchMyStall();

    // If stall exists, then load orders + menu
    if (myStall) {
      await Promise.all([fetchVendorOrders(), fetchVendorMenuItems()]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateStall = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !image) {
      alert("Name, Description and Image are required ❌");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    try {
      await PRIVATE_API.post("/api/stalls/create-stall/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Stall created successfully ✅");

      // reset form
      setName("");
      setDescription("");
      setImage(null);

      // refresh dashboard (stall + orders + menu)
      await fetchDashboardData();
    } catch (err) {
      console.log(err);
      alert("Failed to create stall ❌");
    }
  };

  // ✅ Fix Stall image URL (relative -> full URL)
  let imageUrl = stall?.image || null;
  if (imageUrl && imageUrl.startsWith("/")) {
    imageUrl = `http://127.0.0.1:8000${imageUrl}`;
  }

  // ✅ Helpers
  const getMenuImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("/")) return `http://127.0.0.1:8000${img}`;
    return img;
  };

  const calcOrderTotal = (order) => {
    let total = 0;
    order?.items?.forEach((it) => {
      total += Number(it.quantity) * Number(it.price_at_order_time);
    });
    return total;
  };

  const latestOrders = vendorOrders.slice(0, 5);
  const latestMenuItems = menuItems.slice(0, 6);

  return (
    <div>
      <VendorNavbar />

      <div className="max-w-[1600px] mx-auto px-10 py-8">
        {loading ? (
          <p>Loading dashboard...</p>
        ) : hasNoStall ? (
          <div className="bg-white shadow-md border border-gray-100 rounded-xl p-8 max-w-6xl min-h-auto mx-[150px]">
            <h2 className="text-5xl font-bold text-gray-800 mb-2">
              Create Your Stall 🏪
            </h2>
            <p className="text-gray-600 mb-6">
              You don’t have any stall yet. Create one to start selling food!
            </p>

            <form onSubmit={handleCreateStall} className="flex flex-col gap-5">
              {/* Stall Name */}
              <div>
                <label className="block font-semibold text-gray-700 text-xl mb-2">
                  Stall Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anil Snacks Corner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-6 py-5 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-700 text-xl mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Tell students what you sell..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-6 py-6 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block font-semibold text-gray-700 text-xl mb-2">
                  Stall Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full px-6 py-6 text-lg border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="px-8 py-4 text-lg font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Create Stall ✅
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* ✅ TOP: Stall Info Header */}
            <div className="flex items-start justify-between gap-10 mb-10">
              <div className="flex items-start gap-8">
                {/* Stall Image */}
                <div className="w-[180px] h-[180px] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={stall?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-gray-500 font-semibold">No Image</p>
                  )}
                </div>

                {/* Stall Details */}
                <div>
                  <h2 className="text-4xl font-bold text-gray-800">
                    {stall?.name}
                  </h2>
                  <p className="text-gray-600 mt-3 text-lg max-w-3xl">
                    {stall?.description}
                  </p>

                  <div className="mt-4">
                    {stall?.is_active ? (
                      <span className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">
                        Active ✅
                      </span>
                    ) : (
                      <span className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold">
                        Inactive ❌
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/vendor/menu")}
                  className="px-8 py-4 text-lg font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  + Add Menu Item 🍔
                </button>

                <button
                  onClick={() => navigate("/vendor/orders")}
                  className="px-8 py-4 text-lg font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
                >
                  View All Orders 📦
                </button>
              </div>
            </div>

            {/* ✅ MIDDLE: Incoming Orders */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-800">
                  Incoming Orders 📦
                </h3>

                <button
                  onClick={() => navigate("/vendor/orders")}
                  className="text-orange-500 font-semibold hover:underline"
                >
                  View all →
                </button>
              </div>

              {latestOrders.length === 0 ? (
                <p className="text-gray-600">No orders yet ✅</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {latestOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white shadow-md border border-gray-100 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">
                            Order #{order.id}
                          </h4>
                          <p className="text-gray-600 mt-1">
                            Student:{" "}
                            <span className="font-semibold">
                              {order.student_username}
                            </span>
                          </p>
                        </div>

                        <span className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 font-semibold">
                          {order.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="mt-4">
                        <p className="font-semibold text-gray-700 mb-2">
                          Items:
                        </p>

                        <div className="flex flex-col gap-2">
                          {order.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-gray-700"
                            >
                              <span>
                                {it.menu_item_name} x{" "}
                                <span className="font-semibold">
                                  {it.quantity}
                                </span>
                              </span>
                              <span className="font-semibold">
                                ₹{it.price_at_order_time}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t pt-4">
                          <p className="font-semibold text-gray-800 text-lg">
                            Total
                          </p>
                          <p className="font-bold text-gray-800 text-lg">
                            ₹{calcOrderTotal(order)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ BOTTOM: Menu Preview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-800">
                  Your Menu 🍔
                </h3>

                <button
                  onClick={() => navigate("/vendor/menu")}
                  className="text-orange-500 font-semibold hover:underline"
                >
                  Manage menu →
                </button>
              </div>

              {latestMenuItems.length === 0 ? (
                <p className="text-gray-600">
                  No menu items yet. Add your first item ✅
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {latestMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white shadow-md border border-gray-100 rounded-xl overflow-hidden"
                    >
                      <div className="h-[200px] bg-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={getMenuImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <p className="text-gray-500 font-semibold">No Image</p>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="text-xl font-bold text-gray-800">
                            {item.name}
                          </h4>
                          <p className="font-bold text-gray-800 text-lg">
                            ₹{item.price}
                          </p>
                        </div>

                        <div className="mt-4">
                          {item.is_available ? (
                            <span className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">
                              Available ✅
                            </span>
                          ) : (
                            <span className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold">
                              Not Available ❌
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Menu Item Button */}
              <div className="mt-10">
                <button
                  onClick={() => navigate("/vendor/menu")}
                  className="px-8 py-4 text-lg font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add More Menu Items ➕
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
