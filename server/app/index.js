import express from "express";
import cors from "cors";
import "../db/app.js";
import path from "path";
import * as url from "url";
import { userRouter } from "./routes/users/users.routes.js";
import { accountRouter } from "./routes/acccounts/accounts.routes.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const clientPublicDirPath = path.join(__dirname, "../../client/build");
const apiDocPagePath = path.join(__dirname, "../public");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(clientPublicDirPath));
app.use("/api", express.static(apiDocPagePath));
app.use("/api", userRouter);
app.use("/api", accountRouter);

const PORT = process.env.PORT || 5050;

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../../client/build/index.html"));
// });

app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Server is up at port ${PORT}`);
});
