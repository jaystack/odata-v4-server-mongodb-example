import * as path from "path";
import * as express from "express";
import api from "./ts";

const app = express();

app.use("/api", api);
app.use(express.static('public'))

app.listen(80);