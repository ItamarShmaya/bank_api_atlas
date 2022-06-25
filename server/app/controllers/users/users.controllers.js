import { User } from "../../../db/Schemas/user.schema.js";
import { Account } from "../../../db/Schemas/account.schema.js";
import {
  withdrawCash,
  depositeCash,
  doesUserOwnAccount,
  updateUserTotalCashByAccounts,
} from "../../helpers/users/users.helpers.js";
import { removeOwnerIdFromAccount } from "../../helpers/accounts/accounts.helpers.js";

export const createUser = async (req, res) => {
  const user = new User({ ...req.body, role: "BASIC" });
  try {
    const createdUser = await user.save();
    await updateUserTotalCashByAccounts(createdUser._id);
    const token = await createdUser.generateUserAuthToken();
    const updatedUser = await User.findById(user._id);
    res.status(201).send({ user: updatedUser, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

export const createAdmin = async (req, res) => {
  const user = new User(req.body);
  try {
    user.role = "ADMIN";
    const createdUser = await user.save();
    const token = await createdUser.generateUserAuthToken();
    res.status(201).send({ user: createdUser, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateUserAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

export const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

export const logoutUserAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

export const getAllUsers = async (req, res, next) => {
  if (Object.keys(req.query).length !== 0) return next();
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const getUsersBySearch = async (req, res) => {
  const { minCash, maxCash, firstName, lastName } = req.query;
  try {
    const users = await User.find({
      totalCash: { $lte: maxCash || 999999999999999, $gte: minCash || 0 },
      firstName: { $regex: firstName || "", $options: "i" },
      lastName: { $regex: lastName || "", $options: "i" },
    });
    res.send(users);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User doesn't exist");
    res.send(user);
  } catch (e) {
    res.status(404).send(e.message);
  }
};

export const getUserByIdFull = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User doesn't exist");
    await user.populate("accounts.account");
    res.send(user);
  } catch (e) {
    res.status(404).send(e.message);
  }
};

export const getLoggedinUser = (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.send(403).send();
  }
};

export const getLoggedinUserFull = async (req, res) => {
  try {
    await req.user.populate("accounts.account");
    res.send(req.user);
  } catch (e) {
    res.send(403).send();
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User doesn't exist");
    if (user.totalCash !== 0)
      throw new Error("Can't delete a user with cash or in debt");
    await user.remove();
    res.send(user);
  } catch (e) {
    res.status(404).send(e);
  }
};

export const deleteOwnUser = async (req, res) => {
  try {
    if (req.user.totalCash !== 0)
      throw new Error("Can't delete a user with cash or in debt");
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export const withdraw = async (req, res) => {
  const { id } = req.params;
  const { accountId, amount } = req.body;
  try {
    const user = !id ? req.user : await User.findById(id);
    await withdrawCash(user, accountId, amount);
    const account = await Account.findById(accountId);
    res.send(account);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const deposite = async (req, res) => {
  const { id } = req.params;
  const { accountId, amount } = req.body;
  try {
    const user = !id ? req.user : await User.findById(id);
    await depositeCash(user, accountId, amount);
    const account = await Account.findById(accountId);
    res.send(account);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const transfer = async (req, res) => {
  const { id } = req.params;
  const { fromAccountId, amount, toUserId, toAccountId } = req.body;
  try {
    if (fromAccountId === toAccountId)
      throw new Error("Can't transfer to the same account");
    const fromUser = !id ? req.user : await User.findById(id);
    const toUser = await User.findById(toUserId);
    await withdrawCash(fromUser, fromAccountId, amount);
    await depositeCash(toUser, toAccountId, amount);
    const fromAccount = await Account.findById(fromAccountId);
    const toAccount = await Account.findById(toAccountId);
    res.send({ fromAccount, toAccount });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const updateCredit = async (req, res) => {
  const { id } = req.params;
  const { accountId, amount } = req.body;
  try {
    if (typeof amount !== "number" || amount < 0)
      throw new Error("Credit amount can't be a negetive number");
    const user = await User.findById(id);
    const isValidAccount = user.accounts.some(
      (account) => account.account.toString() === accountId
    );
    if (!isValidAccount) throw new Error("Invalid account id");
    const account = await Account.findById(accountId);
    if (!account.isActive) throw new Error("This account is inactive");
    account.credit = amount;
    await account.save();
    res.send(account);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const addExistingAccount = async (req, res) => {
  const { id } = req.params;
  const { accountId } = req.body;
  try {
    const user = await User.findById(id);
    if (doesUserOwnAccount(user, accountId))
      throw new Error("User already owns this account");
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account doesn't exist");
    account.owners.push({ owner: user._id });
    account.save();
    user.totalCash += account.cash;
    user.accounts.push({ account: accountId });
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const removeAccountFromUser = async (req, res) => {
  const { id } = req.params;
  const { accountId } = req.body;
  try {
    const user = await User.findById(id);
    if (!doesUserOwnAccount(user, accountId))
      throw new Error("User doesn't own this account");
    const account = await Account.findById(accountId);
    const accountIndex = user.accounts.findIndex((account) => {
      return account.account.toString() === accountId;
    });
    user.accounts.splice(accountIndex, 1);
    user.totalCash -= account.cash;
    removeOwnerIdFromAccount(accountId, user._id);
    user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
};
