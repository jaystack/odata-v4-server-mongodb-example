/*import * as express from "express";
import mongoOdataServer from "./mongo";

const app = express();
app.use("/", mongoOdataServer);
app.listen(3000);*/
"use strict";
const express = require("express");
const pgsql_1 = require("./pgsql");
const app = express();
app.use("/", pgsql_1.default);
app.listen(3000);
//# sourceMappingURL=index.js.map