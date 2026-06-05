import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      {/* This invisible component handles all the popup animations! */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
          },
          success: {
            style: { background: "#10B981", color: "white" }, // Tailwind Green-500
            iconTheme: { primary: "white", secondary: "#10B981" },
          },
          error: {
            style: { background: "#EF4444", color: "white" }, // Tailwind Red-500
            iconTheme: { primary: "white", secondary: "#EF4444" },
          },
        }}
      />

      {/* Your standard routing */}
      <AppRoutes />
    </>
  );
}

export default App;
