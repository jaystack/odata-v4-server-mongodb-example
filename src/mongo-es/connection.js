import { MongoClient } from "mongodb";

export default async function(){
    const uri = process.env.NODE_ENV === "production" ?
        "mongodb://mongo/odata-v4-server-example" :
        "mongodb://localhost:27017/odata-v4-server-example";
    return await MongoClient.connect(uri);
};