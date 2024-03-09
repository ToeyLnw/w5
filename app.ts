import express from "express";
import {router as index} from "./api/index"
import {router as IMDB} from "./api/IMDB"
import bodyParser from "body-parser";
export const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/", index);
app.use("/imdb", IMDB);
