import dotenv from "dotenv";

dotenv.config();

export const { MONGO_ATLAS_USERNAME, MONGO_ATLAS_PASSWORD } = process.env;
