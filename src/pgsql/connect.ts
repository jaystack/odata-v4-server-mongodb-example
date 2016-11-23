import * as pg from "pg";

function promisify(client) {
	return new Proxy(client, {
		get(target, name) {
			if (name !== 'query')
				return target[name];
			
			return function(...args) {
				return new Promise((resolve, reject) => {
					target.query(...args, (err, result) => {
						if (err) return reject(err);
						resolve(result);
					});
				});
			}
		}
	});
}

export default async function():Promise<pg.Client> {
	const pool = new pg.Pool({
		user: 'postgres',
		password: 'postgres',
		database: 'northwind_pgsql_test_db'
	});

	return new Promise<pg.Client>((resolve: Function, reject: Function) => {
		pool.connect((err, client) => {
			if (err) return reject(err);
			resolve(promisify(client));
		});
	});
}