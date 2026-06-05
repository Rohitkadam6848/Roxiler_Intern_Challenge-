import { useEffect, useState } from "react";
import {
  getAverageRatingAPI,
  addStoreAPI,
  deleteStoreAPI,
  getSingleStoreAverageAPI,
  getSingleStoreRatingsAPI,
} from "../../api/owner.api";

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("MY_STORES");

  // State for 'My Stores' tab
  const [myStores, setMyStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for 'Add Store' tab
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
  });

  // State for 'Analytics' tab
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [singleStoreStats, setSingleStoreStats] = useState(null);
  const [singleStoreRatings, setSingleStoreRatings] = useState([]);

  // Fetch initial stores on load
  const fetchMyStores = async () => {
    try {
      setLoading(true);
      const res = await getAverageRatingAPI();
      setMyStores(res.data.stores || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStores();
  }, []);

  // --- Handlers ---

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await addStoreAPI(newStore);
      alert("Store created successfully!");
      setNewStore({ name: "", email: "", address: "" });
      fetchMyStores();
      setActiveTab("MY_STORES");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add store");
    }
  };

  const handleDeleteStore = async (id) => {
    if (
      !window.confirm(
        "Are you sure? This will delete the store and ALL its ratings permanently!",
      )
    )
      return;

    try {
      await deleteStoreAPI(id);
      alert("Store deleted successfully!");
      if (selectedStoreId === id.toString()) {
        setSelectedStoreId(""); // Reset analytics if they deleted the currently viewed store
      }
      fetchMyStores();
    } catch (err) {
      alert("Failed to delete store");
    }
  };

  const fetchSingleStoreData = async (storeId) => {
    setSelectedStoreId(storeId);
    if (!storeId) return;

    try {
      const [avgRes, ratingsRes] = await Promise.all([
        getSingleStoreAverageAPI(storeId),
        getSingleStoreRatingsAPI(storeId),
      ]);
      setSingleStoreStats(avgRes.data.store);
      setSingleStoreRatings(ratingsRes.data.ratings || []);
    } catch (err) {
      console.error(err);
    }
  };

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
          Store Owner Dashboard
        </h2>
        <p className="mt-2 text-gray-600">
          Manage your locations and view customer feedback.
        </p>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-4">
        {["MY_STORES", "ADD_STORE", "ANALYTICS"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* TAB 1: MY STORES */}
      {activeTab === "MY_STORES" && (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            My Registered Stores
          </h3>

          {myStores.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
              <p className="text-gray-500 text-lg">
                You haven't opened any stores yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myStores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col overflow-hidden p-6"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 truncate">
                      {store.name}
                    </h3>
                    <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-yellow-50 border border-yellow-100">
                      <span className="text-yellow-500 font-bold mr-1">⭐</span>
                      <span className="font-semibold text-yellow-700">
                        {store.averageRating > 0
                          ? Number(store.averageRating).toFixed(1)
                          : "No ratings yet"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-50 mt-auto">
                    <button
                      onClick={() => {
                        setActiveTab("ANALYTICS");
                        fetchSingleStoreData(store.id.toString());
                      }}
                      className="flex-1 px-3 py-2 bg-cyan-600 text-white text-sm font-medium rounded-md hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ADD STORE */}
      {activeTab === "ADD_STORE" && (
        <div className="animate-fade-in max-w-lg">
          <form
            onSubmit={handleAddStore}
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Open a New Store
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Enter the details of your new location.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
              </label>
              <input
                placeholder="e.g. Om Supermart"
                value={newStore.name}
                onChange={(e) =>
                  setNewStore({ ...newStore, name: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="store@example.com"
                value={newStore.email}
                onChange={(e) =>
                  setNewStore({ ...newStore, email: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location / Address
              </label>
              <input
                placeholder="123 Main St, City"
                value={newStore.address}
                onChange={(e) =>
                  setNewStore({ ...newStore, address: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-4"
            >
              Submit New Store
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SPECIFIC STORE ANALYTICS */}
      {activeTab === "ANALYTICS" && (
        <div className="animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Select Store
            </h3>
            <select
              value={selectedStoreId}
              onChange={(e) => fetchSingleStoreData(e.target.value)}
              className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">-- Choose a store to view --</option>
              {myStores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {selectedStoreId && singleStoreStats && (
            <div className="animate-fade-in">
              <div className="mb-8 flex items-center justify-between bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <div>
                  <h4 className="text-sm font-bold text-yellow-800 uppercase tracking-wider mb-1">
                    Overall Store Rating
                  </h4>
                  <h2 className="text-3xl font-extrabold text-yellow-600">
                    {singleStoreStats.averageRating > 0
                      ? Number(singleStoreStats.averageRating).toFixed(1)
                      : "N/A"}{" "}
                    <span className="text-2xl">/ 5.0</span>
                  </h2>
                </div>
                <div className="text-5xl drop-shadow-md">⭐</div>
              </div>

              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Recent Customer Feedback
              </h4>

              {singleStoreRatings.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200 border-dashed">
                  <p className="text-gray-500">
                    No ratings have been submitted for this store yet.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                          >
                            Customer Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                          >
                            Rating
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {singleStoreRatings.map((row, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {row.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {row.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-bold">
                              ⭐ {row.rating}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(row.created_at).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
