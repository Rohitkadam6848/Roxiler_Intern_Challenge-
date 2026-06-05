import { useEffect, useState } from "react";
import {
  getAllUsersAPI,
  getAllStoresAPI,
  addUserAPI,
  addStoreAPI,
} from "../../api/admin.api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("USERS"); // 'USERS', 'STORES', 'ADD_USER', 'ADD_STORE'

  // Data State
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  // Fetch Data on Load
  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, storesRes] = await Promise.all([
        getAllUsersAPI(),
        getAllStoresAPI(),
      ]);
      setUsers(usersRes.data.users || []);
      setStores(storesRes.data.stores || []);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Form Submits
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUserAPI(newUser);
      alert("User added successfully!");
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });
      fetchData(); // Refresh table
      setActiveTab("USERS");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await addStoreAPI(newStore);
      alert("Store added successfully!");
      setNewStore({ name: "", email: "", address: "", owner_id: "" });
      fetchData(); // Refresh table
      setActiveTab("STORES");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add store");
    }
  };

  // Get only Store Owners for the dropdown
  const storeOwners = users.filter((u) => u.role === "STORE_OWNER");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl font-medium text-gray-500 animate-pulse">
          Loading system data...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          System Administrator
        </h2>
        <p className="mt-2 text-gray-600">
          Manage all users, roles, and stores across the platform.
        </p>
      </div>

      {/* TABS CONTROLS */}
      <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-4">
        {[
          { id: "USERS", label: "All Users" },
          { id: "STORES", label: "All Stores" },
          { id: "ADD_USER", label: "+ Add User" },
          { id: "ADD_STORE", label: "+ Add Store" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: USERS LIST */}
      {activeTab === "USERS" && (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Registered Users
          </h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            u.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "STORE_OWNER"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: STORES LIST */}
      {activeTab === "STORES" && (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Registered Stores
          </h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Store Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Avg Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stores.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {s.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {s.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {s.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {s.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-600">
                        ⭐ {s.rating || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ADD USER */}
      {activeTab === "ADD_USER" && (
        <div className="animate-fade-in max-w-lg">
          <form
            onSubmit={handleAddUser}
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-5"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Create New User
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Manually register a user into the system.
              </p>
            </div>

            <input
              placeholder="Full Name"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Secure Password"
              required
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <input
              placeholder="Physical Address"
              required
              value={newUser.address}
              onChange={(e) =>
                setNewUser({ ...newUser, address: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />

            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer bg-white"
            >
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Administrator</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
            >
              Create User Account
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: ADD STORE */}
      {activeTab === "ADD_STORE" && (
        <div className="animate-fade-in max-w-lg">
          <form
            onSubmit={handleAddStore}
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-5"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Create New Store
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Assign a new store to an existing Store Owner.
              </p>
            </div>

            <input
              placeholder="Store Name"
              required
              value={newStore.name}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <input
              type="email"
              placeholder="Store Contact Email"
              required
              value={newStore.email}
              onChange={(e) =>
                setNewStore({ ...newStore, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <input
              placeholder="Store Address"
              required
              value={newStore.address}
              onChange={(e) =>
                setNewStore({ ...newStore, address: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />

            <select
              required
              value={newStore.owner_id}
              onChange={(e) =>
                setNewStore({ ...newStore, owner_id: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer bg-white"
            >
              <option value="">Select a Store Owner...</option>
              {storeOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-4"
            >
              Register New Store
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
