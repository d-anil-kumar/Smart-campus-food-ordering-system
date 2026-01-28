import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentRoute from "./Authentication/StudentRoute"
import Stalls from "./pages/Stalls";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home Page ✅</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/stalls" element={<StudentRoute><Stalls /></StudentRoute>} />
        <Route path="/student/stalls/:stall_id/menu" element={<StudentRoute><Menu /></StudentRoute>} />
        <Route path="/student/cart" element={<StudentRoute><Cart /></StudentRoute>} />
        <Route path="/student/orders" element= {<StudentRoute><Orders /></StudentRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
