import * as express from "express";
import mongoOdataServer from "./mongo";

const app = express();
app.use("/odata/mongo", mongoOdataServer);
app.listen(3000);