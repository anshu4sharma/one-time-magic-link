import express from "express";
import UserController from "../controller/User";
import { authUser } from "../middewares/authUser";
const router = express.Router();

router.post("/login", UserController.login);

router.post("/signup", UserController.signup);

router.post("/forgot-password", UserController.forgotPassword);

router.post("/reset-password/:id/:token", UserController.resetPassword);

router.get("/user-info",authUser, UserController.userDetails);

export default router;
