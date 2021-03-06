import { Request, Response } from "express";
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const myMongoClient = require("mongodb").MongoClient;
app.use(cors());
require("dotenv").config();

// let url: string = `mongodb+srv://ronawchan:${process.env.MONGODB_PASSWORD}@studioghibli.ns2sq.mongodb.net/test?authSource=admin&replicaSet=atlas-oabmfr-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;
// url is inside of config vars for MongoDB Atlas
const url = process.env.MONGODB_URI;
let dbName: string = "StudioGhibliTitiles";
let collName: string = "StudioGhibliFilms";
let isAscending: boolean = true;
let isDescending: boolean = true;

const GenerateHandleRootGet = (result: []) => {
  return async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  };
};
const GenerateHandleFilmsFunc = (client: typeof myMongoClient) => {
  return function (cmdErr: string, result: []) {
    if (cmdErr) throw new Error(cmdErr);
    app.get("/", GenerateHandleRootGet(result));
    client.close();
  };
};
async function getStudioGhibliFilms(isAscending: boolean) {
  try {
    await myMongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (connectErr: string, client: typeof myMongoClient) {
        if (connectErr) throw new Error(connectErr);
        const coll = client.db(dbName).collection(collName);
        coll
          .find()
          .sort({ title: isAscending ? 1 : -1 })
          .toArray(GenerateHandleFilmsFunc(client));
      }
    );
  } catch (err) {
    console.log(err);
  }
}

const GenerateHandleRatingFunc = (client: typeof myMongoClient) => {
  return function (result: []) {
    app.get("/api/getRating", GenerateHandleRootGet(result));
    client.close();
  };
};
async function getStudioGhibliRating(isDescending: boolean) {
  try {
    await myMongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async function (connectErr: string, client: typeof myMongoClient) {
        if (connectErr) throw new Error(connectErr);
        const coll = client.db(dbName).collection(collName);
        coll
          .find()
          .sort({ rt_score: isDescending ? 1 : -1 })
          .toArray(GenerateHandleRatingFunc(client));
      }
    );
  } catch (error) {
    console.log(error);
  }
}

const GenerateHandleReleaseFunc = (client: typeof myMongoClient) => {
  return function (result: []) {
    app.get("/api/getRelease", GenerateHandleRootGet(result));
    client.close();
  };
};
async function getStudioGhibliRelease(isAscending: boolean) {
  try {
    await myMongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async function (connectErr: string, client: typeof myMongoClient) {
        if (connectErr) throw new Error(connectErr);
        const coll = client.db(dbName).collection(collName);
        coll
          .find()
          .sort({ release_date: isAscending ? 1 : -1 })
          .toArray(GenerateHandleReleaseFunc(client));
      }
    );
  } catch (error) {
    console.log(error);
  }
}

try {
  getStudioGhibliFilms(isAscending);
} catch (err) {
  console.log(err);
}

try {
  getStudioGhibliRating(isDescending);
} catch (err) {
  console.log(err);
}

try {
  getStudioGhibliRelease(isAscending);
} catch (err) {
  console.log(err);
}

app.listen(process.env.PORT || port, () => {
  console.log(`server started at http://localhost:${port}`);
});
