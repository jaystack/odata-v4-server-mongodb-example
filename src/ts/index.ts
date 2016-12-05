import * as express from "express";
import { NorthwindServer } from "./server";

NorthwindServer.create("/api", 3000);