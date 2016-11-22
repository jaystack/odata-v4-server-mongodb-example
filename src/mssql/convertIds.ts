import * as fs from 'fs';
import * as readline from 'readline';

const basePath = "c:/_CODE/odata-v4-server/odata-v4-server-mongodb-example";

convertIds(`${basePath}/src/mssql/categories.ts`, `${basePath}/src/mssql/products.ts`,
           `${basePath}/test/test-cases.js`);

async function convertIds(catFileName: string, prodFileName: string, testFileName: string) {
  let catMap: Map<string, number> = new Map();
  let prodMap: Map<string, number> = new Map();
  let dummyMap: Map<string, number> = new Map();

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
  } catch(e) { }
  catMap = await convertFile(catFileName, findRegex, "$1id$3{{idValue}}$5", " //'$4'=>{{idValue}}", simpleReplacer);
  prodMap = await convertFile(prodFileName, findRegex, "$1id$3{{idValue}}$5", " //'$4'=>{{idValue}}", simpleReplacer);
  await convertFile(getOldFileName(prodFileName), catIdInProdRegex, "$1{{idValue}}$3", " //'$2'->{{idValue}}", catIdInProdReplacer);

  await convertFile(testFileName, testSingleQuoteRegex, "$1{{idValue}}$3", " //'$2'->{{idValue}}", testReplacer);
  await convertFile(getOldFileName(testFileName), testDoubleQuoteRegex, "$1{{idValue}}$3", " //'$2'=>{{idValue}}", testReplacer);

  console.log("\n\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log("\n\n\n>>>", catMap);
  console.log("\n\n\n>>>", prodMap);


  function simpleReplacer(line: string, lineOut: string, findRegex: RegExp, replaceTxt: string, appendTxt: string, id: number, mapOut: Map<string, number>) {
    const idValueIn: string = line.match(findRegex)[4];
    mapOut.set(trimQuotes(idValueIn), ++id);
    lineOut = line.replace(findRegex, replaceTxt.replace(/\{\{idValue\}\}/, String(id)));
    lineOut += (appendTxt.replace(/\$4/, idValueIn)).replace(/\{\{idValue\}\}/, String(id));
    return { lineOut, id, mapOut };
  }

  function catIdInProdReplacer(line: string, lineOut: string, findRegex: RegExp, replaceTxt: string, appendTxt: string, id: number) {
    const idValueIn: string = line.match(findRegex)[2];
    const catId = catMap.get(trimQuotes(idValueIn));
    lineOut = line.replace(findRegex, replaceTxt.replace(/\{\{idValue\}\}/, String(catId)));
    lineOut += (appendTxt.replace(/\$2/, idValueIn)).replace(/\{\{idValue\}\}/, String(catId));
    return { lineOut, id: undefined, mapOut: undefined };
  }

  function testReplacer(line: string, lineOut: string, findRegex: RegExp, replaceTxt: string, appendTxt: string, id: number, mapOut: Map<string, number>) {
    const idValueIn: string = line.match(findRegex)[2];
    const testId = catMap.get(trimQuotes(idValueIn)) || prodMap.get(trimQuotes(idValueIn));
    if (!testId) { console.log("\n\n\n===============================", trimQuotes(idValueIn), "===============================,\n\n\n"); }
    lineOut = line.replace(findRegex, replaceTxt.replace(/\{\{idValue\}\}/, String(testId)));
    lineOut += (appendTxt.replace(/\$2/, idValueIn)).replace(/\{\{idValue\}\}/, String(testId));
    return { lineOut, id, mapOut };
  }

  async function convertFile (fileNameIn: string, findRegex: RegExp, replaceTxt: string, appendTxt: string,
                              replacer: Function): Promise<any> { //:Map<string, number> {
    let logIt = true;
    return new Promise((resolve: Function, reject: Function) => {
      const rl = readline.createInterface({
        input: fs.createReadStream(fileNameIn),
        terminal: false
      });
      const fileNameOut: string = getOldFileName(fileNameIn);
      const wl = fs.createWriteStream(fileNameOut, { flags: 'a' }); // 'a' = append // wl.write('some data')
      let id = 0;
      let mapOut: Map<string, number> = new Map();

      console.log(">", fileNameIn);
      rl.on('line', function(chunk){
          const line = chunk.toString('ascii');
          let lineOut = "";
          //console.log("#", line);
          if (line && findRegex.test(line)) {
            const replacerResults = replacer(line, lineOut, findRegex, replaceTxt, appendTxt, id, mapOut);
            lineOut = replacerResults.lineOut;
            id = replacerResults.id;
            mapOut = replacerResults.mapOut;
            if (logIt) {
              console.log("\n"); console.log(`"${line}"`); console.log(`=> '${lineOut}'`);
              logIt = false;
            }
          } else {
            lineOut = line;
          }
          wl.write(lineOut); wl.write("\n");
      });

      rl.on('close', function(){
        //console.log("finished");
        wl.close;
        return resolve(mapOut);
      });
    });
  }

}

function getOldFileName(fileName: string): string {
  return fileName + ".out." + fileName.slice(-2);
}

function trimQuotes(text: string): string {
  return text.replace(/^\"|\"$/g, "").replace(/^'|'$/g, "").replace(/^\"|\"$/g, "");
}
