import { Account } from "../../../db/Schemas/account.schema.js";

export const removeOwnerIdFromAccount = async (accountId, ownerId) => {
  const account = await Account.findById(accountId);
  if (!account) throw new Error("Account doesn't exist");
  const ownerIndex = account.owners.findIndex(
    (owner) => owner.owner === ownerId
  );
  account.owners.splice(ownerIndex, 1);
  if (account.owners.length === 0) account.remove();
  else account.save();
};

export const addOwnerIdToAccount = async (accountId, ownerId) => {
  const account = await Account.findById(accountId);
  account.owners.push({ owner: ownerId });
  account.save();
};
