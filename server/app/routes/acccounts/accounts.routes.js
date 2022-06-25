import express from "express";
import {
  createAccount,
  getAllAccounts,
  deleteAccount,
} from "../../controllers/accounts/accounts.controllers.js";
import { authUser, authAdmin } from "../../middlewares/auth.js";

export const accountRouter = new express.Router();

accountRouter.post("/accounts", authUser, authAdmin, createAccount);

accountRouter.get("/accounts", authUser, authAdmin, getAllAccounts);

accountRouter.delete("/accounts/:id", authUser, authAdmin, deleteAccount);
