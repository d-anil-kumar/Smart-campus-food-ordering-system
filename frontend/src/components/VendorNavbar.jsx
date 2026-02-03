import { useNavigate } from "react-router-dom";

export default function VendorNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-[2000px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between gap-10">
          {/* Brand/Logo */}
          <h2
            className="text-4xl font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors flex items-center gap-4 whitespace-nowrap"
            onClick={() => navigate("/vendor/dashboard")}
          >
            <span className="text-5xl">🧑‍🍳</span>
            Vendor Dashboard
          </h2>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/vendor/dashboard")}
              className="px-8 py-4 text-lg font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/vendor/orders")}
              className="px-8 py-4 text-lg font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Orders
            </button>

            <button
              onClick={() => navigate("/vendor/menu")}
              className="px-8 py-4 text-lg font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Menu
            </button>

            <button
              onClick={handleLogout}
              className="px-8 py-4 text-lg font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
