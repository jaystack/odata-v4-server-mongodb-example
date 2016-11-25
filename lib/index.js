"use strict";
const express = require("express");
const ts_1 = require("./ts");
const app = express();
app.use("/api", ts_1.default);
app.use(express.static('public'));
app.listen(80);
//# sourceMappingURL=index.js.map