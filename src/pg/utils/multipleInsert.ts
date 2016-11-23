import * as pg from "pg";
import {flatten} from "ramda";

/**
 * This function provides a statement string such as:
 * ($1:int, $2:varchar, $3:boolean),
 * ($2:int, $3:varchar, $4:boolean),
 * ($5:int, $5:varchar, $7:boolean)
 * 
 * The parameters are The
 * 	1) the items in Object[] format: [{Id: 1, Name: 'foo', Active: true}]
 * 	2) the types in String[] format: ['int', 'varchar', 'boolean']
 */

function createPrepareStatementForMultipleInsertion(items: any[]): string {

	const metaColumns = Array.from({length: Object.keys(items[0]).length});
	
	return items.map(
				(item, i) => '(' + metaColumns.map(
						(_, j) => `$${i*metaColumns.length + j + 1}`
					).join(', ') + ')'
			).join(',\n');

	/*return items.map(
				(item, i) => '(' + metaColumns.map(_ => `?`).join(', ') + ')'
			).join(',\n');*/
}

export default async function(db: pg.Client, tableName: string, items: any[], propertyNameProjection?: string[]) {
	
	if (items.length === 0)
		return;
	
	const properties = propertyNameProjection || Object.keys(items[0]);

	const statement = `INSERT INTO "${tableName}"
							(${properties.map(propName => `"${propName}"`).join(', ')})
						VALUES
							${createPrepareStatementForMultipleInsertion(items)}`;
	
	const values = flatten(items.map(item => properties.map(propName => item[propName])));

	return await db.query(statement, values);
}