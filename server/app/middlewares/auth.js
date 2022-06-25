import { User } from "../../db/Schemas/user.schema.js";
import jwt from "jsonwebtoken";
import { TOKEN_USER_SECRET } from "../../config/env_var.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, TOKEN_USER_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

export const authAdmin = async (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    res.status(403).send("Not authorized");
  } else {
    next();
  }
};
