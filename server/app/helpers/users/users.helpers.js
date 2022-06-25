import { Account } from "../../../db/Schemas/account.schema.js";
import { User } from "../../../db/Schemas/user.schema.js";

export const removeAccountIdFromOwner = async (ownerId, accountId) => {
  const user = await User.findById(ownerId);
  if (!user) throw new Error("User doesn't exist");
  const AccountIndex = user.accounts.findIndex(
    (account) => account.account === accountId
  );
  user.accounts.splice(AccountIndex, 1);
  user.save();
};

export const updateUserTotalCashByAccounts = async (userId) => {
  const user = await User.findById(userId);
  await user.populate("accounts.account");
  user.totalCash = 0;
  user.accounts.forEach((account) => {
    user.totalCash += account.account.cash;
  });
  user.save();
};

export const withdrawCash = async (user, accountId, amount) => {
  if (typeof amount !== "number" || amount <= 0)
    throw new Error("Deposite amount must be a positive number");
  if (!doesUserOwnAccount(user, accountId))
    throw new Error("Invalid account id");
  const account = await Account.findById(accountId);
  if (amount > account.cash + account.credit)
    throw new Error(`Can't withdraw that amount`);
  if (!account.isActive) throw new Error("This account is inactive");
  account.cash -= amount;
  await account.save();
  await updateUserTotalCashByAccounts(user._id);
};

export const depositeCash = async (user, accountId, amount) => {
  if (typeof amount !== "number" || amount <= 0)
    throw new Error("Deposite amount must be a positive number");
  if (!doesUserOwnAccount(user, accountId))
    throw new Error("Invalid account id");
  const account = await Account.findById(accountId);
  if (!account.isActive) throw new Error("This account is inactive");
  account.cash += amount;
  await account.save();
  await updateUserTotalCashByAccounts(user._id);
};

export const doesUserOwnAccount = (user, accountId) => {
  return user.accounts.some(
    (account) => account.account.toString() === accountId
  );
};
