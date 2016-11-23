"use strict";
const express = require("express");
const mongo_1 = require("./mongo");
//import mssqlOdataServer from "./mssql";
const app = express();
app.use("/", mongo_1.default);
//app.use("/", mssqlOdataServer);
app.listen(3000);
//# sourceMappingURL=index.js.map