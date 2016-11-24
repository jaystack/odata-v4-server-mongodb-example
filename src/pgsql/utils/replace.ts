import * as pg from "pg";

export default async function replace(db: pg.Client, tableName: string, id: number, item: any) {
	const {rows} = await db.query(`SELECT "Id" FROM "${tableName}" WHERE "Id" = $1`, [id]);
}