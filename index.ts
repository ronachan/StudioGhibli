import { Request, Response } from "express";

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodefetch = require("node-fetch");
const app = express();
const port = 3000;
const MongoClient = require("mongodb").MongoClient;
app.use(cors());
require("dotenv").config();

let url: string = `mongodb+srv://ronawchan:${process.env.MONGODB_PASSWORD}@studioghibli.ns2sq.mongodb.net/test?authSource=admin&replicaSet=atlas-oabmfr-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;
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
    if (cmdErr) throw new Error(cmdErr);
    app.get("/", GenerateHandleRootGet(result));
    client.close();
  };
};
async function getStudioGhibliFilms(isAscending: boolean) {
  await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async function (connectErr: string, client: typeof MongoClient) {
      if (connectErr) throw new Error(connectErr);
      const coll = client
        .db("StudioGhibliTitiles")
        .collection("StudioGhibliFilms");

      coll.find().sort({ title: isAscending?1:-1 }).toArray(GenerateHandleFilmsFunc(client));
    }
  );
}

const GenerateHandleRatingFunc = (client: typeof MongoClient) => {
  return function (cmdErr: string, result: []) {
    if (cmdErr) throw new Error(cmdErr);
    app.get("/api/getRating", GenerateHandleRootGet(result));
    client.close();
  };
};
async function getStudioGhibliRating(isDescending: boolean) {
  await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async function (connectErr: string, client: typeof MongoClient) {
      if (connectErr) throw new Error(connectErr);
      const coll = client
        .db("StudioGhibliTitiles")
        .collection("StudioGhibliFilms");

      coll.find().sort({ rt_score: isDescending?-1:1 }).toArray(GenerateHandleRatingFunc(client));
    }
  );
}

const GenerateHandleReleaseFunc = (client: typeof MongoClient) => {
  return function (cmdErr: string, result: []) {
    if (cmdErr) throw new Error(cmdErr);
    app.get("/api/getRelease", GenerateHandleRootGet(result));
    client.close();
  };
};
async function getStudioGhibliRelease(isAscending: boolean) {
  await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async function (connectErr: string, client: typeof MongoClient) {
      if (connectErr) throw new Error(connectErr);
      const coll = client
        .db("StudioGhibliTitiles")
        .collection("StudioGhibliFilms");

      coll.find().sort({ release_date: isAscending?1:-1 }).toArray(GenerateHandleReleaseFunc(client));
    }
  );
}

getStudioGhibliFilms(isAscending);
getStudioGhibliRating(isDescending);
getStudioGhibliRelease(isAscending);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});