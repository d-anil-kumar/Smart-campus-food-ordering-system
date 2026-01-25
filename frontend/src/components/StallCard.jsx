export default function StallCard({ stall, onViewMenu }) {
  let imageUrl = stall.image;

  // If backend sends "/media/..." convert to full url
  if (imageUrl && imageUrl.startsWith("/")) {
    imageUrl = `http://127.0.0.1:8000${imageUrl}`;
  }

  // placeholder image if no image
  const fallback =
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop";

  return (
    <div
      onClick={() => stall.is_active && onViewMenu()}
      className={`relative rounded-2xl overflow-hidden shadow-md cursor-pointer group ${
        stall.is_active ? "hover:shadow-xl" : "opacity-60 cursor-not-allowed"
      }`}
    >
      {/* Image */}
      <div className="h-[420px] w-full overflow-hidden bg-gray-200">
        <img
          src={imageUrl || fallback}
          alt={stall.name}
          className={`h-full w-full object-cover transition-transform duration-300 ${
            stall.is_active ? "group-hover:scale-105" : ""
          }`}
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Bottom Info Strip */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-white font-bold text-2xl leading-tight">
              {stall.name}
            </h3>

            <p className="text-white/80 text-base">
              {stall.description ? stall.description.slice(0, 40) + "..." : "Food & Snacks"}
            </p>
          </div>

          <div className="text-white text-sm font-semibold">
            {stall.is_active ? "➜" : "Closed"}
          </div>
        </div>
      </div>
    </div>
  );
}
