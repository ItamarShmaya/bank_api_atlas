import express from "express";
import cors from "cors";
import "../db/app.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5050;

app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Server is up at port ${PORT}`);
});
