const express = require("express");
const CalcErr = require("./error");
const stats = require("./statsfunctions");
const app = express();

let numArray = [];

app.use((req, res, next) => {
  try {
    if (!req.query["nums"]) {
      throw new CalcErr("Nums are required!", 400);
    }
  } catch (err) {
    return next(err);
  }
  const numString = req.query["nums"];
  let stringArray = numString.split(",");
  try {
    for (let x of stringArray) {
      temp = Number(x);
      if (isNaN(temp)) {
        throw new CalcErr(`${x} is not a number!`, 400);
      }
      numArray.push(temp);
    }
  } catch (err) {
    return next(err);
  }
  next();
});

app.get("/mean", (req, res, next) => {
  let out = { operation: "mean" };
  out["value"] = stats.getMean(numArray);
  res.send(out);
});

app.get("/median", (req, res, next) => {
  let out = { operation: "median" };
  out["value"] = stats.getMedian(numArray);
  res.send(out);
});

app.get("/mode", (req, res, next) => {
  let out = { operation: "mode" };
  out["value"] = stats.getMode(numArray);
  res.send(out);
});

app.use(function (err, req, res, next) {
  let msg = err.msg;
  res.status(err.status).send(err.msg);
});

app.listen(3000, function () {
  console.log("App on port 3000");
});
