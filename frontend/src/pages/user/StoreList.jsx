import { useEffect, useState } from "react";
import {
  getStoresAPI,
  searchStoresAPI,
  submitRatingAPI,
  updateRatingAPI,
} from "../../api/user.api";

import { CiLocationOn } from "react-icons/ci";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Ratings states
  const [selectedRatings, setSelectedRatings] = useState({});
  // NEW: Track hover state specifically for multiple store cards
  const [hoveredRatings, setHoveredRatings] = useState({});

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await getStoresAPI();
      setStores(res.data.stores || []);
    } catch (err) {
      console.error("FAILED! The error is:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return fetchStores();

    try {
      setLoading(true);
      const res = await searchStoresAPI(searchQuery);
      setStores(res.data.stores || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (storeId, value) => {
    setSelectedRatings({
      ...selectedRatings,
      [storeId]: Number(value),
    });
  };

  const handleRateStore = async (storeId, actionType) => {
    const rating = selectedRatings[storeId];
    if (!rating) {
      return alert("Please select a star rating first.");
    }

    try {
      if (actionType === "SUBMIT") {
        await submitRatingAPI({ store_id: storeId, rating });
        alert("Rating submitted successfully!");
      } else if (actionType === "UPDATE") {
        await updateRatingAPI({ store_id: storeId, rating });
        alert("Rating updated successfully!");
      }
      fetchStores();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          `Failed to ${actionType.toLowerCase()} rating`,
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl font-medium text-gray-500 animate-pulse">
          Loading stores...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Available Stores
        </h2>
        <p className="mt-2 text-gray-600">
          Discover and rate stores in your area.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-10 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by store name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            fetchStores();
          }}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Clear
        </button>
      </form>

      {stores.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
          <p className="text-gray-500 text-lg">
            No stores found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col overflow-hidden"
            >
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                  {store.name}
                </h3>
                <div className="flex items-start gap-2 text-gray-600 text-sm mb-4">
                  <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                  <span className="line-clamp-2">{store.address}</span>
                </div>

                <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 border border-yellow-100">
                  <span className="text-yellow-500 font-bold mr-1">⭐</span>
                  <span className="font-semibold text-yellow-700">
                    {store.overallRating > 0 ? store.overallRating : "Unrated"}
                  </span>
                </div>
              </div>

              {/* RATING CONTROLS - NOW WITH INTERACTIVE STARS */}
              <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col items-center">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Rate this store
                </label>

                {/* 5-Star Row */}
                <div className="flex space-x-2 mb-5 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const currentSelected = selectedRatings[store.id] || 0;
                    const currentHover = hoveredRatings[store.id] || 0;
                    const isGolden =
                      starValue <= (currentHover || currentSelected);

                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => handleRatingChange(store.id, starValue)}
                        onMouseEnter={() =>
                          setHoveredRatings({
                            ...hoveredRatings,
                            [store.id]: starValue,
                          })
                        }
                        onMouseLeave={() =>
                          setHoveredRatings({
                            ...hoveredRatings,
                            [store.id]: 0,
                          })
                        }
                        className={`text-3xl transition-all duration-200 transform hover:scale-110 focus:outline-none ${
                          isGolden
                            ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" // Glowing Golden
                            : "text-gray-300" // Dull Gray
                        }`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>

                {/* Submit / Update Buttons */}
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => handleRateStore(store.id, "SUBMIT")}
                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => handleRateStore(store.id, "UPDATE")}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreList;
