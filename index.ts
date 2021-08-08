import { Request, Response } from "express";
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const MongoClient = require("mongodb").MongoClient;
app.use(cors());
require("dotenv").config();

// let url: string = `mongodb+srv://ronawchan:${process.env.MONGODB_PASSWORD}@studioghibli.ns2sq.mongodb.net/test?authSource=admin&replicaSet=atlas-oabmfr-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;
const url = process.env.MONGODB_URI;
let dbName: string = "StudioGhibliTitiles";
let collName: string = "StudioGhibliFilms";
let isAscending: boolean = true;
let isDescending: boolean = true;

const GenerateHandleRootGet = (result: []) => {
  return async (
    req: Request,
    res: Response
  ) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  };
};
const GenerateHandleFilmsFunc = (client: typeof MongoClient) => {
  return function (cmdErr: string, result: []) {
    if(cmdErr) throw new Error(cmdErr);
      app.get("/", GenerateHandleRootGet(result));
      client.close();
  };
};
async function getStudioGhibliFilms(isAscending: boolean) {
  try{
    await MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async function (connectErr: string, client: typeof MongoClient) {
        if(connectErr) throw new Error(connectErr);
          const coll = client.db(dbName).collection(collName);
          coll.find().sort({ title: isAscending?1:-1 }).toArray(GenerateHandleFilmsFunc(client));  
      }
    );
  }catch(err){
    console.log(err);
  }
}

// const GenerateHandleRatingFunc = (client: typeof MongoClient) => {
//   return function (result: []) {
//     try{
//       app.get("/api/getRating", GenerateHandleRootGet(result));
//       client.close();
//     }catch(cmdErr){
//       console.log(cmdErr);
//     }
//   };
// };
// async function getStudioGhibliRating(isDescending: boolean) {
//   try{
//     await MongoClient.connect(
//       url,
//       { useNewUrlParser: true, useUnifiedTopology: true },
//       async function (client: typeof MongoClient) {
//         try{
//           const coll = client.db(dbName).collection(collName);
//           coll.find().sort({ rt_score: isDescending?1:-1 }).toArray(GenerateHandleRatingFunc(client));
//         }catch(connectErr){
//           console.log(connectErr);
//         }
//       }
//     );
//   }catch(error){
//     console.log(error);
//   }
// }

// const GenerateHandleReleaseFunc = (client: typeof MongoClient) => {
//   return function (result: []) {
//     try{
//       app.get("/api/getRelease", GenerateHandleRootGet(result));
//       client.close();
//     }catch(cmdErr){
//       console.log(cmdErr);
//     }
//   };
// };
// async function getStudioGhibliRelease(isAscending: boolean) {
//   try{
//     await MongoClient.connect(
//       url,
//       { useNewUrlParser: true, useUnifiedTopology: true },
//       async function (client: typeof MongoClient) {
//         try{
//           const coll = client.db(dbName).collection(collName);
//           coll.find().sort({ release_date: isAscending?1:-1 }).toArray(GenerateHandleReleaseFunc(client));
//         }catch(connectErr){
//           console.log(connectErr);
//         }
//       }
//     );
//   }catch(error){
//     console.log(error);
//   }
// }

getStudioGhibliFilms(isAscending);
// getStudioGhibliRating(isDescending);
// getStudioGhibliRelease(isAscending);

app.listen(process.env.PORT || port, () => {
  console.log(`server started at http://localhost:${port}`);
});
