import { useState } from "react";
import { PUBLIC_API } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { PRIVATE_API } from "../api/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await PUBLIC_API.post("/api/token/", {
        username: username,
        password: password,
      });

      // ✅ store tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("Login Successful ✅");

      const meRes = await PRIVATE_API.get("/api/me/"); // Authorization header auto attaches from axios interceptor

      const role = meRes.data.role;

      if (role === "STUDENT") {
        navigate("/student/stalls");
      } else if (role === "VENDOR") {
        navigate("/vendor/dashboard");
      } else {
        alert("Unknown role ❌ Contact admin");
        navigate("/login");
      }
    } catch (err) {
      alert("Login Failed ❌ Check username/password");
      console.log(err);
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

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-10 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Welcome Back</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Username</label>
              <input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
              <input
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-orange-500 text-white py-3.5 text-base rounded-lg font-semibold hover:bg-orange-600 mt-8"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-orange-500 font-semibold hover:text-orange-600"
              >
                Register here
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