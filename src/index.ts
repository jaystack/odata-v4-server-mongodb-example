import * as express from "express";
import mongoOdataServer from "./mongo";
//import mssqlOdataServer from "./mssql";

const app = express();
app.use("/", mongoOdataServer);
//app.use("/", mssqlOdataServer);
app.listen(3000);