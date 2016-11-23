"use strict";
const express = require("express");
//import mongoOdataServer from "./mongo";
const mssql_1 = require("./mssql");
const app = express();
//app.use("/", mongoOdataServer);
app.use("/", mssql_1.default);
app.listen(3000);
//# sourceMappingURL=index.js.map