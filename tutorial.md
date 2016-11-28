# JayStack OData v4 Server tutorial

## Introduction

In this tutorial, we will create an OData v4 server using JayStack OData v4 Server and will use a MongoDB database as data storage. We will use TypeScript here, but you can use ES6 too to implement your OData service. Our data model will be a simple Northwind-like model publishing categories and products.

## Installation

To start working with *odata-v4-server*, you have to install the server module dependency and to help your work in accessing a MongoDB database when using OData, install the *odata-v4-mongodb* connection module.

```
npm install --save odata-v4-server@rc
npm install --save odata-v4-mongodb
```

There are connectors available for MongoDB, MS-SQL, MySQL, PostgreSQL and for in-memory usage and more connectors will be available in the future or even you can write a custom connector.

To access the MongoDB database, add the native MongoDB Driver for node.js as a dependency.

```
npm install --save mongodb
```

## Creating the data model

Our data model is using two types for categories and products. We create two classes for these types, *Category* and *Product*. To annotate these classes with OData type information, we will use the *Edm* decorator system available from the *odata-v4-server* module.

The *Category* class definition without the *Edm* decorators will be:

```typescript
class Category{
    _id:ObjectID
    Description:string
    Name:string
    Products:Product[]
}
```

and the *Product* class will be:

```typescript
class Product{
    _id:ObjectID
    Category:Category
    CategoryId:ObjectID
    Discontinued:boolean
    Name:string
    QuantityPerUnit:string
    UnitPrice:number
}
```

### Using *Edm* decorators

The *Edm* decorator system provides a wide range of decorators for you to annotate your classes for OData v4 publication.

The most important *Edm* decorators are the type property decorators. These type property decorators doesn't give you any automatic conversion, they are just type annotation (like in TypeScript) and effects only your OData metadata information. All OData v4 standard primitive types are available to use. These are:

* Edm.Binary
* Edm.Boolean
* Edm.Byte
* Edm.Date
* Edm.DateTimeOffset
* Edm.Decimal
* Edm.Double
* Edm.Duration
* Edm.Guid
* Edm.Int16
* Edm.Int32
* Edm.Int64
* Edm.SByte
* Edm.Single
* Edm.Stream
* Edm.String
* Edm.TimeOfDay

The *Edm* decorator system supports both Geometry and Geography types, which are:

* Edm.GeometryPoint
* Edm.GeometryPolygon
* Edm.GeometryLineString
* Edm.GeometryMultiPoint
* Edm.GeometryMultiPolygon
* Edm.GeometryMultiLineString
* Edm.GeometryCollection
* Edm.GeographyPoint
* Edm.GeographyPolygon
* Edm.GeographyLineString
* Edm.GeographyMultiPoint
* Edm.GeographyMultiPolygon
* Edm.GeographyMultiLineString
* Edm.GeographyCollection

There are also some special property decorators, which give you behavior annotation on the property used. These are:

* Edm.Computed
* Edm.Key
* Edm.Nullable
* Edm.Required

To create navigation properties or complex type properties, you can use the *Edm.EntityType* or the *Edm.ComplexType* decorators. If a navigation property has a partner property on the opposite side of the navigation, you can annotate the metadata with the *Edm.Partner* property decorator.

If an entity or complex type class reference is not available at the point of property definition, you can use the full name of your entity or complex type as a string parameter of the decorator. If you omit the namespace from the type name, it will use the namespace fallback strategy of the *Edm* and *odata* decorator system (see later in this turorial).

You can combine the primitive type decorators or the *Edm.EntityType* or *Edm.ComplexType* decorators with the *Edm.Collection* decorator to annotate a property to be a collection of a given type.

Our two entity type classes, *Category* and *Product* with *Edm* decorators will look like this:

```typescript
import { Edm } from "odata-v4-server";

class Category{
    @Edm.Key
    @Edm.Computed
    @Edm.String
    _id:ObjectID

    @Edm.String
    Description:string

    @Edm.String
    Name:string

    @Edm.Collection(Edm.EntityType("Product"))
    @Edm.Partner("Category")
    Products:Product[]
}

class Product{
    @Edm.Key
    @Edm.Computed
    @Edm.String
    _id:ObjectID

    @Edm.EntityType("Category")
    @Edm.Partner("Products")
    Category:Category

    @Edm.String
    @Edm.Required
    CategoryId:ObjectID

    @Edm.Boolean
    Discontinued:boolean

    @Edm.String
    Name:string

    @Edm.String
    QuantityPerUnit:string

    @Edm.Decimal
    UnitPrice:number
}
```

### Annotation

You can attach custom annotation to types and properties using the *Edm.Annotate* decorator. You have to define an annotation with a term and a value. This will look like:

```typescript
@Edm.Annotate({
    term: "UI.DisplayName",
    string: "Products"
})
class Product{
    ...
}
```

### Implementing entity bound actions/functions

Entity types can define entity bound actions and functions. You can implement an action or function in the entity type class. Use the *Edm.Action* or *Edm.Function* decorators to publish your TypeScript function as an OData entity bound action or function. *JayStack OData v4 Server* supports async/await, Promise and ES6 generators for asynchronous OData actions/functions. If you are creating an entity bound function, you can define the return type of that function by using the *Edm* type property decorators just as like on the properties before or as the parameter of the *Edm.Function* decorator. If your entity bound function has any input parameters, you can annotate the parameter with the *Edm* type decorators too. A simple example:

```typescript
@Edm.Function
@Edm.String
echo( @Edm.String message:string ){
    return message;
}
```

If you need access to the entity in context of your action or function, use the *result* parameter decorator from the *odata* decorator system. This way the server will call your function providing you the result from the last part from the resource path of the OData URL through the annotated parameter. An example from the *Product* class:

```typescript
import { Edm, odata } from "odata-v4-server";

@Edm.Function
@Edm.Decimal
getUnitPrice( @odata.result result:Product ){
    return result.UnitPrice;
}
```

*Keep in mind: OData actions return with 204 NoContent HTTP response and only OData functions can give back result!*

*ES6 doesn't support parameter decorators! To use the parameter decorators from the __Edm__ or __odata__ decorator system use the __parameter__ function decorator.*

```javascript
@Edm.Function
@Edm.Decimal
@odata.parameter("result", odata.result)
getUnitPrice(result){
    return result.UnitPrice;
}
```

## Creating your controllers

Controllers are the containers of functionality of our OData server entity sets. You have to implement a controller for each of your entity types. For our *Category* and *Product* entity types, we have to implement the *CategoriesController* and the *ProductsController*. These classes are extending the core *ODataController* class available from the *odata-v4-server* module.

```typescript
import { ODataController } from "odata-v4-server";

class CategoriesController extends ODataController{
    ...
}

class ProductsController extends ODataController{
    ...
}
```

### Using *odata* decorators

To start implementing functionality in the controllers, we will use the *odata* decorator system.

First we have to use the *type* class decorator to bind an entity type to the controller class.

```typescript
@odata.type(Category)
class CategoriesController extends ODataController{
    ...
}
```

To implement basic CRUD functionality in the controller, we have to implement TypeScript functions for each operation. The *JayStack OData v4 Server* will recognize and find these functions when they are correctly decorated with function decorators available from the *odata* decorator system.

*You don't have to use any function naming conventions, this will be working only by using the decorators!*

The CRUD *odata* function decorators are corresponding to the same HTTP method available in OData v4 standard: GET, POST, PUT, PATCH and DELETE.

Our implementation for returning an entity collection on the *Categories* entity set will be decorated like this:

```typescript
@odata.GET
find(){
    ...
}
```

To implement entity result by the entity key from the entity set (like ```/Categories(1)```) you have to use the *key* parameter decorator and you will get the entity key in that parameter from the server.

```typescript
@odata.GET
findOne( @odata.key key:number ){
    ...
}
```

To implement navigation on properties, use the *odata* method function decorators with the name of the navigation property as the first parameter of the decorator:

```typescript
@odata.GET("Products")
getProducts(){
    ...
}
```

Again, to support navigation by key on the navigation property, use the *key* parameter decorator.

```typescript
@odata.GET("Products")
getProduct( @odata.key key:number ){
    ...
}
```

The *result* parameter decorator used for actions/functions before are available in navigation implementations too. In the *result* parameter, you will get the result of your implementation of the previous navigation part, the *Category* entity in the example below:

```typescript
@odata.GET("Products")
getProduct( @odata.key key:number, @odata.result result:Category ){
    ...
}
```

For the create and update implementations in your controller, you can use the *body* parameter decorator to access the OData request body. The POST implementation in the *CategoriesController* will be like:

```typescript
@odata.POST
insert( @odata.body data:Category ){
    ...
}
```

### Filtering result

If you want to allow filtering of data in your controller, you will need to get access to the OData filter already processed by the *odata-v4-server* module and use a helper connector module to compile that filter information specific to your platform. In this tutorial we will use the *JayStack OData v4 MongoDB Connector*. To get the filter information, use the *filter* parameter decorator. In the parameter, you will get the AST tree of the OData *$filter*. You can use this AST tree to implement filtering your data. The connector modules provide you a simple and easy way to compile the AST tree to a more convenient format to your selected platform.

```typescript
import { ODataQuery } from "odata-v4-server";
import { createFilter } from "odata-v4-mongodb";

...

@odata.GET
async find( @odata.filter filter:ODataQuery ){
    let db = await mongodb();
    let mongodbQuery = createFilter(filter);
    return db.collection("Categories").find(mongodbQuery).toArray();
}
```

### More query options

If you need access to all OData query options, use the *query* parameter decorator and use the *createQuery* function from the selected connector.

```typescript
import { ODataQuery } from "odata-v4-server";
import { createQuery } from "odata-v4-mongodb";

...

@odata.GET
async find( @odata.query query:ODataQuery ){
    let db = await mongodb();
    let mongodbQuery = createQuery(query);
    return db.collection("Categories").find(
        mongodbQuery.query,
        mongodbQuery.projection,
        mongodbQuery.skip,
        mongodbQuery.limit
    ).toArray();
}
```

### Streaming result

When you have a large result set, it's better to pipe it directly into the response stream. To achieve this, you have to use the *stream* parameter decorator. In the decorated parameter you will get a writable stream. That stream will perform OData result transformation on the result and then sends it forward to your response stream.

```typescript
async function delay(ms:number):Promise<void>{
    return new Promise(resolve => setTimeout(resolve, ms));
}

class StreamController extends ODataController{
    @odata.GET
    async getItems( @odata.stream stream:Writable ){
        for (let i = 0; i < 10000; i++){
            let item = { id: i, value: `item #${i}` };
            stream.write(item);
            await delay(100);
        }
        stream.end();
    }
}
```

### Implementing entity collection bound actions/functions

If you create your OData action/function in your controller class, it will be bound to the entity collection of your entity type of the controller. Implementing the action/function is the same as the entity bound action/function was.

```typescript
@Edm.Function
@Edm.EntityType(Product)
async getCheapest(): Promise<Product>{
    let db = await mongodb();
    return (await db.collection("Products").find().sort({ UnitPrice: 1 }).limit(1).toArray())[0];
}
```

## Creating your server

So far we have a *Category* and *Product* entity type and the corresponding *CategoriesController* and *ProductsController* for our types with CRUD features and some OData actions and functions. To access the controllers we have to create an OData server class. This will be the main class of our OData service. You can publish your OData server class as a HTTP server, as an Express Router, you can use it as a node.js transform stream or call it directly. To implement an OData server class, just extend the *ODataServer* class. Typically your server class will be empty and you just bind your controllers with class decorators.
To define a schema namespace for your server, use the *namespace* decorator from the *odata* decorator system or the default namespace will be *Default*.

```typescript
import { ODataServer } from "odata-v4-server";

@odata.namespace("Northwind")
class NorthwindServer extends ODataServer{
    ...
}
```

**OData namespace fallback strategy:** the fallback chain for OData namespaces is *property* -> *type* -> *controller* -> *server* -> ```"Default"```.

### Publish controllers

To publish the *CategoriesController* and the *ProductsController* you have to use the *controller* class decorator. Decorate your server class with the *controller* decorator to bind the controllers to the server. You can create public bindings which will be public entity sets on your OData service. By default, the name of the entity set will be created automatically from the name of your controller class by removing *Controller* from the class name. If this is not the way you want it, you can define the exact entity set name for your controller.

```typescript
@odata.namespace("Northwind")
@odata.controller(CategoriesController, true)
@odata.controller(ProductsController, "Products")
class NorthwindServer extends ODataServer{
    ...
}
```

### Implementing action/function imports

You can implement service bound action/function imports in your server class. Again, this will be the same as entity or entity collection bound actions or functions was previously, but this time the function decorator will be *ActionImport* or *FunctionImport* instead of *Action* or *Function*.

```typescript
@odata.namespace("Northwind")
@odata.controller(CategoriesController, true)
@odata.controller(ProductsController, "Products")
export class NorthwindServer extends ODataServer{
    @Edm.ActionImport
    async initDb(){
        ...
    }
}
```

## Publish your server on HTTP

If you want to just quickly launch your OData service and you don't want to write custom implementations around it (like authentication, extra middlewares, etc.) you can use the static *create* function of your server class. Starting the OData service on a given port is so simple:

```typescript
NorthwindServer.create("/odata", 3000);
```

This way, you will access your OData service on [http://localhost:3000/odata](http://localhost:3000/odata).

### Enabling CORS

To enable *CORS* on your OData service, decorate your server class with the *cors* class decorator. This will only work if you use your server class as a HTTP server or as an Express Router.

```typescript
@odata.cors
@odata.namespace("Northwind")
@odata.controller(CategoriesController, true)
@odata.controller(ProductsController, "Products")
export class NorthwindServer extends ODataServer{
    ...
}
```

### Use your server as an Express Router

If you use Express as a HTTP server and you need advanced customization, you can create an Express Router with the *create* function if you call it without any parameters.

```typescript
app.use("/odata", NorthwindServer.create());
app.listen(3000);
```

### Use your server as a node.js stream

You can utilize your OData server class as a node.js Transform stream. The stream is an object mode stream. You write context objects into the stream and the stream will pipe out the result objects. The context object will have to include the *url* and *method* fields and optionally the *body*.

```javascript
let stream = new NorthwindServer();
stream.pipe(process.stdout);
stream.write({
    url: "/Categories",
    method: "GET"
});
stream.write({
    url: "/Categories",
    method: "POST",
    body: {
        ...
    }
});
```

### Use your server as a library

All the previous features internally wrap the static *execute* method of the OData server class. This is the final and most advanced way to access your OData functionality. This way you can use your OData service in any environments according to your controller features. By default the method will be *GET*.

```typescript
NorthwindServer.execute("/Categories").then( ... );
NorthwindServer.execute("/Categories", "POST", { ... }).then( ... );
```

## Final words

This tutorial was a starting point to get a quick overview about *JayStack OData v4 Server*. You learned how you can create and implement core parts of the OData service. You can find the full OData example service [here](https://github.com/jaystack/odata-v4-server-mongodb-example). Watch out for more and advanced tutorials!