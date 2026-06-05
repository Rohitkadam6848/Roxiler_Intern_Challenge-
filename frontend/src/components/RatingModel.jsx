import { useState } from "react";
import { submitRatingAPI, updateRatingAPI } from "../api/rating.api";

const RatingModal = ({ store, onClose, onSuccess }) => {
  const [rating, setRating] = useState(store.userRating || 0); // Actual saved rating
  const [hoverRating, setHoverRating] = useState(0); // Tracks mouse hover for the glowing effect

  const handleSubmit = async () => {
    if (rating === 0) {
      return alert("Please select a star rating first!");
    }

    try {
      if (store.userRating) {
        await updateRatingAPI(store.id, { rating });
      } else {
        await submitRatingAPI({
          store_id: store.id,
          rating,
        });
      }

      alert("Rating saved!");
      onSuccess();
    } catch (err) {
      console.log(err);
      alert("Failed to submit rating");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm transform transition-all">
        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
          Rate {store.name}
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Tap a star to set your rating
        </p>

        {/* --- INTERACTIVE STAR RATING SYSTEM --- */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex space-x-2 cursor-pointer">
            {[1, 2, 3, 4, 5].map((starValue) => {
              // Decide if this star should be golden or gray
              const isGolden = starValue <= (hoverRating || rating);

              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`text-4xl transition-all duration-200 transform hover:scale-110 focus:outline-none
                    ${
                      isGolden
                        ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" // Glowing Golden
                        : "text-gray-300" // Dull Gray
                    }
                  `}
                >
                  ★
                </button>
              );
            })}
          </div>

          {/* Subtle text showing the selected number */}
          <span className="text-sm font-medium text-gray-500 mt-3 h-5">
            {rating > 0 ? `${rating} out of 5 stars` : "No rating selected"}
          </span>
        </div>

        {/* Buttons Container */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
