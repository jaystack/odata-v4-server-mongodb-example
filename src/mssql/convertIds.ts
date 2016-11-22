import * as fs from 'fs';
import * as readline from 'readline';

const basePath = "c:/_CODE/odata-v4-server/odata-v4-server-mongodb-example";

convertIds(`${basePath}/src/mssql/categories.ts`, `${basePath}/src/mssql/products.ts`, "testFileName");

function convertIds(catFileName: string, prodFileName: string, testFileName: string) {
  let catMap: Map<string, number> = new Map();
  let prodMap: Map<string, number> = new Map();

  const basePath = "c:/_CODE/odata-v4-server/odata-v4-server-mongodb-example";
  const findRegex = /(.*\{")(_id)(":.*)("5[^'",]*")(,.*\}.*)/; // $1 - $5 where _id in $2, "ObjectId" in $4
  convertFile(catFileName, `${basePath}/src/mssql/categories.out.ts`,
              findRegex, "$1id$3{{idValue}}$5", " //'$4'=>{{idValue}}", catMap);
  convertFile(prodFileName, `${basePath}/src/mssql/products.out.ts`,
              findRegex, "$1id$3{{idValue}}$5", " //'$4'=>{{idValue}}", prodMap);

  console.log("\n\n\n>>>"); //, catMap.size);

  function convertFile(fileNameIn: string, fileNameOut: string, findRegex: RegExp, replaceTxt: string, appendTxt: string, mapIn: Map<string, number>) { //:Map<string, number> {
    const rl = readline.createInterface({
      input: fs.createReadStream(fileNameIn),
      terminal: false
    });
    const wl = fs.createWriteStream(fileNameOut, { flags: 'a' }); // 'a' = append // wl.write('some data')
    let id = 0;
    let mapOut: Map<string, number> = new Map();

    console.log(">", fileNameIn);
    rl.on('line', function(chunk){
        const line = chunk.toString('ascii');
        //console.log("#", line);
        if (line && findRegex.test(line)) {
          const idValueIn: string = line.match(findRegex)[4];
          mapIn.set(idValueIn, ++id);
          let lineOut = line.replace(findRegex, replaceTxt.replace(/\{\{idValue\}\}/, String(id)));
          lineOut += (appendTxt.replace(/\$4/, idValueIn)).replace(/\{\{idValue\}\}/, String(id));
          console.log(`"${line}"`); console.log(`=> '${lineOut}'`);
        }
    });

    rl.on('close', function(){
      //console.log("finished");
      wl.close;
      return mapIn;
    });
  }

}
