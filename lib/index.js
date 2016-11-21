"use strict";
const express = require("express");
const mongo_1 = require("./mongo");
const app = express();
app.use("/", mongo_1.default);
app.listen(3000);
//# sourceMappingURL=index.js.map