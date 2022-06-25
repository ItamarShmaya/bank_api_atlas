import { Account } from "../../../db/Schemas/account.schema.js";
import { User } from "../../../db/Schemas/user.schema.js";

export const createAccount = async (req, res) => {
  try {
    if (req.body.owners.length > 1)
      throw new Error("Can only provide 1 owner at a time");
    if (req.body.cash < 0)
      throw new Error("Can't create a new account in a deficit");
    const user = await User.findById(req.body.owners[0].owner);
    if (!user) throw new Error("User doesn't exist");
    const account = new Account(req.body);
    const createdAccount = await account.save();
    user.accounts.push({ account: createdAccount._id });
    user.totalCash += createdAccount.cash;
    user.save();
    res.send(createdAccount);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.send(accounts);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const deleteAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const account = await Account.findById(id);
    if (!account) throw new Error("Account doesn't exist");
    if (account.cash !== 0)
      throw new Error("Can't delete an account with cash or in debt");
    await account.remove();
    res.send(account);
  } catch (e) {
    res.status(404).send(e.message);
  }
};
