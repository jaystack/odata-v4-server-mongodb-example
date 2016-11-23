import * as express from "express";
import mysqlOdataServer from "./mysql/index";

const app = express();
app.use("/", mysqlOdataServer);
app.listen(3000);