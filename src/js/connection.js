import { MongoClient, Db } from "mongodb";

export default async function(){
    return await MongoClient.connect("mongodb://localhost:27017/odata-v4-server-mongodb-example");
};