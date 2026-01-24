import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {PUBLIC_API} from "../api/axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ send register data to backend
      await PUBLIC_API.post("/api/register/", {
        username: username,
        password: password,
        role: role,
      });

      alert("Registration successful ✅ Now login");
      navigate("/login");
    } catch (err) {
      alert("Registration failed ❌");
      console.log("REGISTER ERROR:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo/Brand Section */}
        <div className="text-center mb-10">
          <div className="inline-block bg-orange-500 text-white px-5 py-3 rounded-lg mb-4">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Smart Campus</h1>
          <p className="text-lg text-gray-600">Food Ordering System</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Register</h1>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Username</label>
              <input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
              <input
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="STUDENT">Student</option>
                <option value="VENDOR">Vendor</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3.5 text-base rounded-lg font-semibold hover:bg-orange-600 mt-8 disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-orange-500 font-semibold hover:text-orange-600"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-base mt-8">
          Order your favorite campus meals with ease
        </p>
      </div>
    </div>
  );
}