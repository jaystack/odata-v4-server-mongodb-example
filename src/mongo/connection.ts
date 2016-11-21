import { MongoClient, Db } from "mongodb";

export default async function():Promise<Db>{
    return await MongoClient.connect("mongodb://127.0.0.1:27017/odata-v4-server-example");
};