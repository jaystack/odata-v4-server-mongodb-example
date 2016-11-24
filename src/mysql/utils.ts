export function promisifyWithDdName(client) {
  return new Proxy(client, {
    get(target, name) {
      if (name !== 'query')
        return target[name];

      return function (...args) {
        return new Promise((resolve, reject) => {
          target.query(`USE northwind_mysql_test_db`, (error, res) => {
            if (error) return reject(error);
            target.query(...args, (err, result) => {
              if (err) return reject(err);
              resolve(result);
            })
          })
        });
      }
    }
  });
}

export function getDeltaObjectInSQL(delta: any): string {
  const deltaKeys = Object.keys(delta);
  if (deltaKeys.length == 1) return `${deltaKeys[0]}=${delta[deltaKeys[0]]}`;
  return deltaKeys.reduce((prev, current) => `${prev}=${delta[prev]}, ${current}=${delta[current]}`);
}

export function mapDiscontinued(results: any[]): any[] {
  return results.map(result => {
    result.Discontinued = (result.Discontinued == 1) ? true : false;
    return result;
  });
}

/*export function getUpsertQuery(data: any): string {
const dataKeys = Object.keys(data);
const dataLength = dataKeys.length;

}

`INSERT INTO Products (Id,QuantityPerUnit,UnitPrice,CategoryId,Name,Discontinued) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE QuantityPerUnit=?,UnitPrice=?,CategoryId=?,Name=?,Discontinued=?`, [key, data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued, data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued]*/