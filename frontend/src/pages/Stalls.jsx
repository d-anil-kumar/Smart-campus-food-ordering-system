import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PUBLIC_API } from "../api/axios";

import StudentNavbar from "../components/StudentNavbar";
import StallCard from "../components/StallCard";

export default function Stalls() {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchStalls = async () => {
    try {
      const res = await PUBLIC_API.get("/api/stalls/");
      setStalls(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load stalls ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStalls();
  }, []);

  const filteredStalls = stalls.filter((stall) =>
    stall.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <StudentNavbar search={search} setSearch={setSearch} />

      <div className="max-w-[1600px] mx-auto px-10 py-8">
        <h1 className="text-5xl font-bold mb-10">Available Stalls</h1>

        {loading ? (
          <p>Loading stalls...</p>
        ) : filteredStalls.length === 0 ? (
          <p>No stalls found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredStalls.map((stall) => (
              <StallCard
                key={stall.id}
                stall={stall}
                onViewMenu={() => navigate(`/student/stalls/${stall.id}/menu`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
