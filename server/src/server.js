const http = require('http');
/*
But hold on a second for these values to be populated we need to actually apply the changes using our dotenv package.
We can do that in our server.js by calling the required() function.
And importing the dots and package.
We're not going to set this to a constant because we'll just call the .config() function directly on
the module. This is the only function, the only property of the .env module that we're going to be taking
advantage of.
*/
/*
And the reason why we call this function above any of our local imports here, these files that live
inside our source code is because we want the environment to be populated not just in our server.js,
but also in all of these other files when we import them.
 */
require('dotenv').config();
// const mongodb = require('mongodb');
const { mongoConnect } = require('./services/mongo');
// const mongoose = require('mongoose');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

// const MONGO_URL =
//   'mongodb+srv://nasa-api:fkTCR9JOHrgqH7Kl@nasacluster.n3pr9.mongodb.net/?retryWrites=true&w=majority&appName=NASACluster';

const server = http.createServer(app);

// mongoose.connection.once('open', () => {
//   console.log('MongoDB connection ready');
// });

// mongoose.connection.on('error', (err) => {
//   console.error(err);
// });

async function startTheServer() {
  // await mongoose.connect(MONGO_URL);
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on the port ${PORT}...`);
  });
}

startTheServer();
/*
And we don't have to await our function because nothing happens after we start our server.
That is a lot happens, but it's all in this function.
There's no code that relies on start server having already completed below right here.
*/
// ...
