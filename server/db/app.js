import mongoose from "mongoose";
import {
  MONGO_ATLAS_USERNAME,
  MONGO_ATLAS_PASSWORD,
} from "../config/env_var.js";

const URI = `mongodb+srv://${MONGO_ATLAS_USERNAME}:${MONGO_ATLAS_PASSWORD}@bankapi.czn2nnh.mongodb.net/bankApi?retryWrites=true&w=majority`;

mongoose.connect(URI, (error, mongoDBInstance) => {
  if (error) throw new Error("Mongo Connection Error: " + error);
  if (!process.env.NODE_ENV) {
    const { host, port, name } = mongoDBInstance;
    console.log({ host, port, name });
  }
});
