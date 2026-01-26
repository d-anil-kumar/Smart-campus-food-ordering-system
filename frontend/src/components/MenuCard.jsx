import { useCart } from "../context/CartContext";

export default function MenuCard({ item, stallId }) {
  const { addToCart } = useCart();

  let imageUrl = item.image;
  if (imageUrl && imageUrl.startsWith("/")) {
    imageUrl = `http://127.0.0.1:8000${imageUrl}`;
  }

  const fallback =
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="h-[260px] w-full bg-gray-100 overflow-hidden">
        <img
          src={imageUrl || fallback}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-bold">{item.name}</h2>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              item.is_available
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {item.is_available ? "Available" : "Not Available"}
          </span>
        </div>

        <p className="text-xl font-semibold mt-4">₹{item.price}</p>

        <button
          disabled={!item.is_available}
          onClick={() => addToCart(item, Number(stallId))}
          className={`mt-5 w-full py-3 rounded-xl font-semibold transition ${
            item.is_available
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {item.is_available ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
