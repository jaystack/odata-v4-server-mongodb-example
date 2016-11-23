"use strict";
const express = require("express");
const index_1 = require("./mysql/index");
const app = express();
app.use("/", index_1.default);
app.listen(3000);
//# sourceMappingURL=mysql.js.map