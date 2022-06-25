import mongoose from "mongoose";
import {
  removeAccountIdFromOwner,
  updateUserTotalCashByAccounts,
} from "../../app/helpers/users/users.helpers.js";

const accountSchema = new mongoose.Schema({
  cash: {
    type: Number,
    default: 0,
  },

  credit: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error("Credit can't be negetive");
    },
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  owners: {
    type: [
      {
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "users",
        },
      },
    ],
    validate(value) {
      if (value.length < 1) throw new Error("Must provide an owner");
    },
  },
});

accountSchema.methods.toJSON = function () {
  const account = this;
  const accountObject = account.toObject();
  delete accountObject.__v;
  return accountObject;
};

accountSchema.post("remove", async (doc, next) => {
  const account = doc;
  account.owners.forEach(async (owner) => {
    await removeAccountIdFromOwner(owner.owner, account._id);
  });
  next();
});

accountSchema.post("save", async (doc, next) => {
  const account = doc;
  if (account.isModified("cash")) {
    account.owners.forEach(async (owner) => {
      await updateUserTotalCashByAccounts(owner.owner);
    });
  }
  next();
});

export const Account = mongoose.model("accounts", accountSchema);
