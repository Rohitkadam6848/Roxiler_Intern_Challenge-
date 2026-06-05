import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getStores,
  searchStores,
  submitRating,
  updateRating,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/stores", authMiddleware, roleMiddleware("USER"), getStores);

router.get(
  "/stores/search",
  authMiddleware,
  roleMiddleware("USER"),
  searchStores,
);

router.post("/rating", authMiddleware, roleMiddleware("USER"), submitRating);

router.put("/rating", authMiddleware, roleMiddleware("USER"), updateRating);

export default router;
