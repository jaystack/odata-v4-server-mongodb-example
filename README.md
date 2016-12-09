# odata-v4-server-pgsql-example
MongoDB Server example for **[JayStack OData V4 Server](https://github.com/jaystack/odata-v4-server)**

## About JayStack OData V4 Server (odata-v4-server)
This example uses **JayStack OData V4 Server [(odata-v4-server)](https://github.com/jaystack/odata-v4-server)** and [odata-v4-mongodb](https://github.com/jaystack/odata-v4-mongodb) repositories.

You can read more about **JayStack OData V4 Server** in our tutorial at ...

Also there are sevaral other examples on **JayStack OData V4 Server (odata-v4-server)**:
- [client example using React](https://github.com/jaystack/odata-v4-server-react-client-example)
- [server example using MySql](https://github.com/jaystack/odata-v4-mysql-example)
- [server example using MSSql](https://github.com/jaystack/odata-v4-server-mssql-example)
- [server example using MongoDb](https://github.com/jaystack/odata-v4-server-mongodb-example)

## About the examples

## Technical details of this example

### Setting up the connection
You may customize the db connection options
by editing [connect.ts](https://github.com/jaystack/odata-v4-server-mongodb-example/blob/master/src/ts/connect.ts#L6).
By default, these are the options:
```js
"mongodb://localhost:27017/northwind"
```
By default, the database will listen on `port` `27017` therefore it is not set above.

### Building the application
```
npm run build
```

### Testing the application
```
npm test
```

### Starting the application
```
npm start
```

### Creating sample data
After starting the application (it will listen on `localhost:3000` by default) you can generate / recreate the sample dataset
by submitting [localhost:3000/initDb](http://localhost:3000/initDb).
Alternatively if you start unit tests (`npm test`) then the database will be initialized automatically.
