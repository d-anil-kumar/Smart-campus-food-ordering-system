import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PUBLIC_API } from "../api/axios";
import StudentNavbar from "../components/StudentNavbar";
import MenuCard from "../components/MenuCard";

export default function Menu() {
  const { stall_id } = useParams();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchMenuItems = async () => {
    try {
      const res = await PUBLIC_API.get(`/api/stalls/${stall_id}/menu/`);
      setMenuItems(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load menu ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (item) => {
    alert(`Added to cart ✅: ${item.name}`);
  };

  return (
    <div>
      <StudentNavbar search={search} setSearch={setSearch} />

      <div className="max-w-[1600px] mx-auto px-10 py-8">
        <button
          onClick={() => navigate("/student/stalls")}
          className="mb-6 text-orange-500 font-semibold"
        >
          ← Back to Stalls
        </button>

        <h1 className="text-4xl font-bold mb-8">Menu 🍔</h1>

        {loading ? (
          <p>Loading menu...</p>
        ) : filteredMenu.length === 0 ? (
          <p>No menu items found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredMenu.map((item) => (
              <MenuCard key={item.id} item={item} stallId={stall_id} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
