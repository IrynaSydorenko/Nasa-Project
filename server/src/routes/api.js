const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

const api = express.Router();

// And remember how we used express.Router()?
// We can just add all of the routes and middleware for that api router by calling the use() function.

api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api;
