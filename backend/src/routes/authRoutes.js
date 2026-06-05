import express from "express";
import {
  login,
  signup,
  updatePassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/update-password", updatePassword);

export default router;
