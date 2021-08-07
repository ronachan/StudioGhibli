const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const app = express();
const port = 3000;
const { MongoClient } = require("mongodb");
app.use(cors())
require('dotenv').config();
var url = `mongodb+srv://ronawchan:${process.env.MONGODB_PASSWORD}@studioghibli.ns2sq.mongodb.net/test?authSource=admin&replicaSet=atlas-oabmfr-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;

async function getStudioGhibliFilms() {
  await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async function (connectErr, client) {
      if(connectErr) throw connectErr;
      const coll = client
        .db("StudioGhibliTitiles")
        .collection("StudioGhibliFilms");
      await coll.find().toArray(function (cmdErr, result) {
        if (cmdErr) throw cmdErr;

        app.get("/", async (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        });
        client.close();
      });
    }
  );
}

async function sortRating() {
  await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async function (connectErr, client) {
      if(connectErr) throw connectErr;
      const coll = client
        .db("StudioGhibliTitiles")
        .collection("StudioGhibliFilms");
      await coll.find().sort({ rt_score: -1 }).toArray(function (cmdErr, result) {
        if (cmdErr) throw cmdErr;

        app.get("/api/sortRating", async (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        });
        client.close();
      });
    }
  );
}

async function sortYear(isAscending) {

  await MongoClient.connect(
    url,    
    { useNewUrlParser: true, useUnifiedTopology: true },
    async function (connectErr, client) {
      if(connectErr) throw connectErr;
      const coll = client
        .db("StudioGhibliTitiles")
        .collection("StudioGhibliFilms");
      await coll.find().sort({ release_date: isAscending?1:-1 }).toArray(function (cmdErr, result) {
        if (cmdErr) throw cmdErr;

        app.get("/api/sortYear", async (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        });
        client.close();
      });
    }
  );
}

async function sortTitle() {
  await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async function (connectErr, client) {
      if(connectErr) throw connectErr;
      const coll = client
        .db("StudioGhibliTitiles")
        .collection("StudioGhibliFilms");
      await coll.find().sort({ title: 1 }).toArray(function (cmdErr, result) {
        if (cmdErr) throw cmdErr;

        app.get("/api/sortTitle", async (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        });
        client.close();
      });
    }
  );
}

const myListenFunction = (args) => {
  console.log(`Example app listening at http://localhost:${port}`);
};

getStudioGhibliFilms();
sortRating();
sortYear();
sortTitle();
// host the ROOT at 3000 (port)
app.listen(port, myListenFunction);
