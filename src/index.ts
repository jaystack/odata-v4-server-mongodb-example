/*import * as express from "express";
import mongoOdataServer from "./mongo";

const app = express();
app.use("/", mongoOdataServer);
app.listen(3000);*/

import * as express from "express";
import pgServer from "./pgsql";

const app = express();
app.use("/", pgServer);
app.listen(3000);