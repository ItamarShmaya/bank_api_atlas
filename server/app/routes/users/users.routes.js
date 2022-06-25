import express from "express";
import {
  createUser,
  createAdmin,
  loginUser,
  logoutUser,
  logoutUserAll,
  getAllUsers,
  getUserById,
  getUserByIdFull,
  getLoggedinUser,
  getLoggedinUserFull,
  deleteUser,
  deleteOwnUser,
  withdraw,
  deposite,
  transfer,
  updateCredit,
  addExistingAccount,
  removeAccountFromUser,
  getUsersBySearch,
} from "../../controllers/users/users.controllers.js";
import { authUser, authAdmin } from "../../middlewares/auth.js";

export const userRouter = new express.Router();

userRouter.post("/users", authUser, authAdmin, createAdmin);
userRouter.post("/users/register", createUser);
userRouter.post("/users/login", loginUser);
userRouter.post("/users/logout", authUser, logoutUser);
userRouter.post("/users/logoutAll", authUser, logoutUserAll);

userRouter.get("/users", authUser, authAdmin, getAllUsers);
userRouter.get("/users", authUser, authAdmin, getUsersBySearch);
userRouter.get("/users/me", authUser, getLoggedinUser);
userRouter.get("/users/me/full", authUser, getLoggedinUserFull);
userRouter.get("/users/:id", authUser, authAdmin, getUserById);
userRouter.get("/users/:id/full", authUser, authAdmin, getUserByIdFull);

userRouter.patch("/users/me/withdraw", authUser, withdraw);
userRouter.patch("/users/me/deposite", authUser, deposite);
userRouter.patch("/users/me/transfer", authUser, transfer);
userRouter.patch("/users/:id/withdraw", authUser, authAdmin, withdraw);
userRouter.patch("/users/:id/deposite", authUser, authAdmin, deposite);
userRouter.patch("/users/:id/credit", authUser, authAdmin, updateCredit);
userRouter.patch("/users/:id/transfer", authUser, authAdmin, transfer);
userRouter.patch(
  "/users/:id/add-account",
  authUser,
  authAdmin,
  addExistingAccount
);
userRouter.patch(
  "/users/:id/remove-account",
  authUser,
  authAdmin,
  removeAccountFromUser
);

userRouter.delete("/users/me", authUser, deleteOwnUser);
userRouter.delete("/users/:id", authUser, authAdmin, deleteUser);
