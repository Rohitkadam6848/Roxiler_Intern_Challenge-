import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // <-- We need this to read the token!

const Navbar = () => {
  // 1. Look for the token in Redux, not the user object
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // 2. If there is no token, hide the Navbar
  if (!token) return null;

  // 3. Decode the token to safely get the user's role
  let role = "User";
  try {
    const decodedUser = jwtDecode(token);
    role = decodedUser.role;
  } catch (error) {
    console.error(`Invalid token${error}`);
  }

  // 4. Beautiful Tailwind CSS UI
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Brand / Logo Area */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          R
        </div>
        <span className="text-xl font-bold text-gray-800 hidden sm:block">
          Roxiler Rating App
        </span>
      </div>

      {/* Right Side: Role Badge & Logout */}
      <div className="flex items-center space-x-4">
        {/* Role Badge */}
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-100 shadow-sm hidden sm:block">
          Role: {role.replace("_", " ")}
        </span>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
