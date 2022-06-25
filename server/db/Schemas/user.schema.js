import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { TOKEN_USER_SECRET } from "../../config/env_var.js";
import { removeOwnerIdFromAccount } from "../../app/helpers/accounts/accounts.helpers.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid email");
    },
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },

  totalCash: {
    type: Number,
    default: 0,
  },

  role: {
    type: String,
    default: "BASIC",
  },

  accounts: [
    {
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
      },
    },
  ],

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.role;
  delete userObject.__v;
  return userObject;
};

userSchema.methods.generateUserAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, TOKEN_USER_SECRET);
  user.tokens.push({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.post("remove", async (doc, next) => {
  const user = doc;
  user.accounts.forEach(async (account) => {
    await removeOwnerIdFromAccount(account.account, user._id);
  });
  next();
});

export const User = mongoose.model("users", userSchema);
