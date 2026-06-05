import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stores on load
  useEffect(() => {
    API.get("/user/stores")
      .then((res) => {
        setStores(res.data.stores || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl font-medium text-gray-500 animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          User Dashboard
        </h2>
        <p className="mt-2 text-gray-600">
          Explore and rate your favorite stores.
        </p>
      </div>

      {/* Grid Layout */}
      {stores.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
          <p className="text-gray-500 text-lg">
            No stores available right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col overflow-hidden"
            >
              {/* Store Details */}
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                  {s.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 flex items-start">
                  <span className="mr-2">📍</span>
                  <span className="line-clamp-2">{s.address}</span>
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 border border-yellow-100">
                  <span className="text-yellow-500 font-bold mr-1">⭐</span>
                  <span className="font-semibold text-yellow-700">
                    {s.overallRating > 0 ? s.overallRating : "Unrated"}
                  </span>
                </div>
              </div>

              {/* Rating Component */}
              <RatingBox storeId={s.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RATING BOX COMPONENT (With Interactive Stars)
// ---------------------------------------------------------------------------

const RatingBox = ({ storeId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // Tracks mouse for glow effect

  const submit = async () => {
    if (rating === 0) return alert("Please select a star rating first!");

    try {
      await API.post("/user/rating", {
        store_id: storeId,
        rating,
      });
      alert("Rating submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col items-center">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Rate this store
      </label>

      {/* 5 Interactive Stars */}
      <div className="flex space-x-2 mb-5 cursor-pointer">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isGolden = starValue <= (hoverRating || rating);

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className={`text-3xl transition-all duration-200 transform hover:scale-110 focus:outline-none ${
                isGolden
                  ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" // Glowing yellow
                  : "text-gray-300" // Dull grey
              }`}
            >
              ★
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      <button
        onClick={submit}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm"
      >
        Submit Rating
      </button>
    </div>
  );
};
