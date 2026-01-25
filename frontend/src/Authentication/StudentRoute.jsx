import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PRIVATE_API } from "../api/axios";

export default function StudentRoute({ children }) {
  const token = localStorage.getItem("access");

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!token) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      try {
        const res = await PRIVATE_API.get("/api/me/");
        const role = res.data.role;

        if (role === "STUDENT") setAllowed(true);
        else setAllowed(false);
      } catch (err) {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [token]);

  if (loading) return <div>Checking access...</div>;

  if (!allowed) return <Navigate to="/login" replace />;

  return children;
}
