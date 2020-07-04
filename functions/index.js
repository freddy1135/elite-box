var functions = require('firebase-functions');
var express = require('express');
var app = express();

exports.app = functions.https.onRequest(app);