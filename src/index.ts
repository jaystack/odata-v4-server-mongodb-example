import * as path from "path";
import * as express from "express";
import * as cors from "cors";

import api from "./ts";

const app = express();

app.use(cors());
app.use("/api", api);
app.use(express.static('public'))

app.listen(80);