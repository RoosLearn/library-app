import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { bookRouter } from "./book.routes";
import * as path from 'path';
 
// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
 
const { ATLAS_URI } = process.env;
 
if (!ATLAS_URI) {
   console.error("No ATLAS_URI environment variable has been defined in config.env");
   process.exit(1);
}
 
connectToDatabase(ATLAS_URI)
   .then(() => {
       const app = express();
       app.use(cors());
 
app.use("/books", bookRouter);

       // start the Express server
       app.listen(5200, () => {
           console.log(`Server running at http://localhost:5200...`);
       });
 
   })
   .catch(error => console.error(error));

   //hosting to cyclic

const app = express();
app.use(express.static(path.join(__dirname, 'dist', 'mylibrary')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'mylibrary', 'index.html'));
  });
