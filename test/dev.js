const NorthwindServerES = require("../lib/js/server").NorthwindServer;
const NorthwindServer = require("../lib/ts/server").NorthwindServer;

NorthwindServerES.create(3000);
NorthwindServer.create(3001);