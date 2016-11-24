import * as pg from "pg";
import {flatten} from "ramda";

/**
 * This function provides a statement string such as:
 * ($1, $2, $3),
 * ($2, $3, $4),
 * ($5, $5, $7)
 * 
 * The parameters are the
 * 	1) the items in Object[] format: [{Id: 1, Name: 'foo', Active: true}]
 */

function getPrepareStatement(items: any[]): string {

	const metaColumns = Array.from({length: Object.keys(items[0]).length});
	
	return items.map(
				(item, i) => '(' + metaColumns.map(
						(_, j) => `$${i*metaColumns.length + j + 1}`
					).join(', ') + ')'
			).join(',\n');
}

export default async function(db: pg.Client, tableName: string, items: any[], propertyNameProjection?: string[]) {
	
	if (items.length === 0)
		return;
	
	const properties = propertyNameProjection || Object.keys(items[0]);

	const statement = `INSERT INTO "${tableName}"
							(${properties.map(propName => `"${propName}"`).join(', ')})
						VALUES
							${getPrepareStatement(items)}`;
	
	const values = flatten(items.map(item => properties.map(propName => item[propName])));

	return await db.query(statement, values);
}