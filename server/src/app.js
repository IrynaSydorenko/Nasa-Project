const express = require('express');
// const planetsRouter = require('./routes/planets/planets.router');
// const launchesRouter = require('./routes/launches/launches.router');
const api = require('./routes/api');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

// app.listen(); - using the node built in HTTP module we use server.listen() instead

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
); // cors() the function that returns the cors middleware
// We can pass in an options object here, which takes an origin property that we can set to the origin,
// which we want to allow.
// So in our case, it will be http://localhost:3000.

app.use(morgan('combined'));

app.use(express.json()); //перевіряє формат json/placeholder, перетворює тіло запиту (body) з JSON-формату в звичайний JavaScript-об’єкт
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', api);

// app.use('/v1/planets', planetsRouter);
// app.use('/v1/launches', launchesRouter);
// app.use('/v1/launches', launchesRouter)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
