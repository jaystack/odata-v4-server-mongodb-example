"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require('fs');
const readline = require('readline');
const basePath = "c:/_CODE/odata-v4-server/odata-v4-server-mongodb-example";
convertIds(`${basePath}/src/mssql/categories.ts`, `${basePath}/src/mssql/products.ts`, `${basePath}/test/test-cases.js`);
function convertIds(catFileName, prodFileName, testFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let catMap = new Map();
        let prodMap = new Map();
        let dummyMap = new Map();
        const basePath = "c:/_CODE/odata-v4-server/odata-v4-server-mongodb-example";
        const findRegex = /(.*\{")(_id)(": *)("5[^'",]*")(,.*\}.*)/; // $1 - $5 where _id in $2, "ObjectId" value in $4
        const catIdInProdRegex = /(.*\{.*,"CategoryId": *)("5[^'",]*")(\,.*\}.*)/; // $1 - $3 where "CategoryId" value in $2
        const testSingleQuoteRegex = /(.*)('5[^'",]*')(.*)/; // $1 - $3 where toBeReplaced value in $2
        const testDoubleQuoteRegex = /(.*)("5[^'",]*")(.*)/; // $1 - $3 where toBeReplaced value in $2
        try {
            fs.unlinkSync(getOldFileName(catFileName));
            fs.unlinkSync(getOldFileName(prodFileName));
            fs.unlinkSync(getOldFileName(getOldFileName(prodFileName)));
            fs.unlinkSync(getOldFileName(testFileName));
            fs.unlinkSync(getOldFileName(getOldFileName(testFileName)));
        }
        catch (e) { }
        catMap = yield convertFile(catFileName, findRegex, "$1id$3{{idValue}}$5", " //'$4'=>{{idValue}}", simpleReplacer);
        prodMap = yield convertFile(prodFileName, findRegex, "$1id$3{{idValue}}$5", " //'$4'=>{{idValue}}", simpleReplacer);
        yield convertFile(getOldFileName(prodFileName), catIdInProdRegex, "$1{{idValue}}$3", " //'$2'->{{idValue}}", catIdInProdReplacer);
        yield convertFile(testFileName, testSingleQuoteRegex, "$1{{idValue}}$3", " //'$2'->{{idValue}}", testReplacer);
        yield convertFile(getOldFileName(testFileName), testDoubleQuoteRegex, "$1{{idValue}}$3", " //'$2'=>{{idValue}}", testReplacer);
        console.log("\n\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("\n\n\n>>>", catMap);
        console.log("\n\n\n>>>", prodMap);
        function simpleReplacer(line, lineOut, findRegex, replaceTxt, appendTxt, id, mapOut) {
            const idValueIn = line.match(findRegex)[4];
            mapOut.set(trimQuotes(idValueIn), ++id);
            lineOut = line.replace(findRegex, replaceTxt.replace(/\{\{idValue\}\}/, String(id)));
            lineOut += (appendTxt.replace(/\$4/, idValueIn)).replace(/\{\{idValue\}\}/, String(id));
            return { lineOut, id, mapOut };
        }
        function catIdInProdReplacer(line, lineOut, findRegex, replaceTxt, appendTxt, id) {
            const idValueIn = line.match(findRegex)[2];
            const catId = catMap.get(trimQuotes(idValueIn));
            lineOut = line.replace(findRegex, replaceTxt.replace(/\{\{idValue\}\}/, String(catId)));
            lineOut += (appendTxt.replace(/\$2/, idValueIn)).replace(/\{\{idValue\}\}/, String(catId));
            return { lineOut, id: undefined, mapOut: undefined };
        }
        function testReplacer(line, lineOut, findRegex, replaceTxt, appendTxt, id, mapOut) {
            const idValueIn = line.match(findRegex)[2];
            const testId = catMap.get(trimQuotes(idValueIn)) || prodMap.get(trimQuotes(idValueIn));
            if (!testId) {
                console.log("\n\n\n===============================", trimQuotes(idValueIn), "===============================,\n\n\n");
            }
            lineOut = line.replace(findRegex, replaceTxt.replace(/\{\{idValue\}\}/, String(testId)));
            lineOut += (appendTxt.replace(/\$2/, idValueIn)).replace(/\{\{idValue\}\}/, String(testId));
            return { lineOut, id, mapOut };
        }
        function convertFile(fileNameIn, findRegex, replaceTxt, appendTxt, replacer) {
            return __awaiter(this, void 0, void 0, function* () {
                let logIt = true;
                return new Promise((resolve, reject) => {
                    const rl = readline.createInterface({
                        input: fs.createReadStream(fileNameIn),
                        terminal: false
                    });
                    const fileNameOut = getOldFileName(fileNameIn);
                    const wl = fs.createWriteStream(fileNameOut, { flags: 'a' }); // 'a' = append // wl.write('some data')
                    let id = 0;
                    let mapOut = new Map();
                    console.log(">", fileNameIn);
                    rl.on('line', function (chunk) {
                        const line = chunk.toString('ascii');
                        let lineOut = "";
                        //console.log("#", line);
                        if (line && findRegex.test(line)) {
                            const replacerResults = replacer(line, lineOut, findRegex, replaceTxt, appendTxt, id, mapOut);
                            lineOut = replacerResults.lineOut;
                            id = replacerResults.id;
                            mapOut = replacerResults.mapOut;
                            if (logIt) {
                                console.log("\n");
                                console.log(`"${line}"`);
                                console.log(`=> '${lineOut}'`);
                                logIt = false;
                            }
                        }
                        else {
                            lineOut = line;
                        }
                        wl.write(lineOut);
                        wl.write("\n");
                    });
                    rl.on('close', function () {
                        //console.log("finished");
                        wl.close;
                        return resolve(mapOut);
                    });
                });
            });
        }
    });
}
function getOldFileName(fileName) {
    return fileName + ".out." + fileName.slice(-2);
}
function trimQuotes(text) {
    return text.replace(/^\"|\"$/g, "").replace(/^'|'$/g, "").replace(/^\"|\"$/g, "");
}
//# sourceMappingURL=convertIds.js.map