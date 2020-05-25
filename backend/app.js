const express = require('express');
const {urlencoded, json} = require('body-parser');
const ScoreController = require('../backend/scoreController');

const app = express();
app.use(json());
app.use(urlencoded({extended: false}));


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PATCH, DELETE'
    );

    return res.status(200).json({});
  }

  next();
});


app.get('/', ScoreController.getScoreList);
app.post('/', ScoreController.insertScore);

app.use(function (req, res, next) {
    res.status(404).send("Bad request.");
});

module.exports = app;