import { MongoClient } from "mongodb";

export default async function(){
    const uri = process.env.NODE_ENV === "production" ?
        "mongodb://mongo/northwind" :
        "mongodb://localhost:27017/northwind";
    return await MongoClient.connect(uri);
};