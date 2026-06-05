import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  addStore,
  addUser,
  getAllStores,
  getAllUser,
  getUserById,
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  },
);

router.post("/add-user", authMiddleware, roleMiddleware("ADMIN"), addUser);
router.get("/users", authMiddleware, roleMiddleware("ADMIN"), getAllUser);
router.get("/users/:id", authMiddleware, roleMiddleware("ADMIN"), getUserById);
router.post("/stores", authMiddleware, roleMiddleware("ADMIN"), addStore);
router.get("/stores", authMiddleware, roleMiddleware("ADMIN"), getAllStores);

export default router;
