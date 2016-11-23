/*import * as express from "express";
import mongoOdataServer from "./mongo";

const app = express();
app.use("/", mongoOdataServer);
app.listen(3000);*/
"use strict";
const express = require("express");
const pg_1 = require("./pg");
const app = express();
app.use("/", pg_1.default);
app.listen(3000);
//# sourceMappingURL=index.js.map