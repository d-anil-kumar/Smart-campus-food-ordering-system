import { useNavigate } from "react-router-dom";

export default function StudentNavbar({ search, setSearch }) {
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
            onClick={() => navigate("/student/stalls")}
          >
            <span className="text-5xl">🍽️</span>
            Smart Campus Food
          </h2>

          {/* Search Box */}
          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search for Stalls"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/student/orders")}
              className="px-8 py-4 text-lg font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap"
            >
              My Orders
            </button>
            <button 
              onClick={() => navigate("/student/cart")}
              className="px-8 py-4 text-lg font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Cart
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