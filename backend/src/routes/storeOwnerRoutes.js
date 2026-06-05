import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getAverageRating,
  getStoreRatings,
  createStore,
  deleteStore,
  getSingleStoreAverageRating,
  getSingleStoreRatings,
} from "../controllers/storeOwnerController.js";

const router = express.Router();

// Existing Routes (All Stores combined)
router.get(
  "/average-rating",
  authMiddleware,
  roleMiddleware("STORE_OWNER"),
  getAverageRating,
);
router.get(
  "/ratings",
  authMiddleware,
  roleMiddleware("STORE_OWNER"),
  getStoreRatings,
);

// New Routes: Store Management
router.post(
  "/add-store",
  authMiddleware,
  roleMiddleware("STORE_OWNER"),
  createStore,
);
router.delete(
  "/store/:id",
  authMiddleware,
  roleMiddleware("STORE_OWNER"),
  deleteStore,
);

// New Routes: Specific Store Analytics
router.get(
  "/store/:id/average-rating",
  authMiddleware,
  roleMiddleware("STORE_OWNER"),
  getSingleStoreAverageRating,
);
router.get(
  "/store/:id/ratings",
  authMiddleware,
  roleMiddleware("STORE_OWNER"),
  getSingleStoreRatings,
);

export default router;
