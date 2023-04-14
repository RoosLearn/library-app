import * as mongodb from "mongodb";
 
export interface Book {
   name: string;
   author: string;
   genre: "Children" | "Adventure" | "Biography" | "Mystery" | "Fiction";
   year: string;
   _id?: mongodb.ObjectId;
}