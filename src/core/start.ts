import express from "express";
import z from "zod";
import bodyParser from "body-parser";
import cors from "cors";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import dotenv from "dotenv";
import mainRouter from "../routes/mainRouter.js";
dotenv.config();
const app = express();

initializeApp({
  credential: applicationDefault(),
})


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(mainRouter);

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log('Server listening on port 3010');
});
