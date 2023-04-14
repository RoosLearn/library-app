import * as mongodb from "mongodb";
import {Book } from "./book";
 
export const collections: {
   books?: mongodb.Collection<Book>;
} = {};
 
export async function connectToDatabase(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();
 
   const db = client.db("meanStackExample");
   await applySchemaValidation(db);
 
   const booksCollection = db.collection<Book>("books");
   collections.books = booksCollection;
}
 
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
   const jsonSchema = {
       $jsonSchema: {
           bsonType: "object",
           required: ["name", "author", "genre", "year"],
           additionalProperties: false,
           properties: {
               _id: {},
               name: {
                   bsonType: "string",
                   description: "'name' is required and is a string",
               },
               author: {
                   bsonType: "string",
                   description: "'author' is required and is a string",
                   minLength: 5
               },
               genre: {
                   bsonType: "string",
                   description: "'genre' is required and is one of 'Children', 'Adventure',  'Biography' , 'Mystery' or 'Fiction'",
                   enum: ["Children", "Adventure", "Biography" , "Mystery", "Fiction"]
               },
               year: {
                bsonType: "string",
                description: "'year' is required and is a string",
            },
           },
       },
   };
 
   // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
       collMod: "books",
       validator: jsonSchema
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("books", {validator: jsonSchema});
       }
   });
}