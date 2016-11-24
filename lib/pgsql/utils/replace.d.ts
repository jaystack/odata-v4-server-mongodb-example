import * as pg from "pg";
export default function replace(db: pg.Client, tableName: string, id: number, item: any): Promise<void>;
