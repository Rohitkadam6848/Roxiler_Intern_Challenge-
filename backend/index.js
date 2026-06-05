import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import storeOwnerRoutes from "./src/routes/storeOwnerRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/store", storeOwnerRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API Running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
