import { MongoClient, Db } from "mongodb";

export default async function():Promise<Db>{
    return await MongoClient.connect("mongodb://localhost:27017/odata-v4-server-example");
};