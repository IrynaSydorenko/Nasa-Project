const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planets = require('./planets.mongo');
// We've seen that the return value from our CSV pass module is a function
// that we can call like so:

// parse();

// So and that function returns an event emitter that deals
// with streams of data coming in from that file.

// But the pass function doesn't deal with files directly.
// It only knows about streams, which is where nodes built in.
// File system module is going to help us do what we need to do.

/*
const promise = new Promise ((resolve, reject) => {
  resolve(42)
  })
  .then((result) => result.json())
  or
  const result = await promise.json()
*/

// const habitablePlanets = [];
// const results = [];

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

// function isHabitablePlanet(data) {
//   data.filter((planet) => planet['koi_disposition'] === 'CONFIRMED');
// }

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      // How do we connect the parse function with the read stream for our file?
      // Well, because the parse function is designed to be used with streams like our readable stream.
      // What we can do is pipe the output of our file to the parse function like so
      // by calling the dot pipe function on the stream, passing in the results of the pass function.
      // What this is doing is it's connecting the two streams together.

      // What this is doing is it's connecting the two streams together.
      // The pipe function is meant to connect a readable stream source to a readable stream destination

      // We have our Kepler Planets data csv file, and we read that file as a stream by calling the fs.createReadStream('kepler_data.csv')
      // function and passing in the path to our CSV file.
      // This stream here can then be piped to connect it to another stream.
      // This time, a stream that is taking in data and processing it.
      // Somehow, this readable stream here is the result that we get from calling the pass function from our
      // CSV library, and the result that we're hoping for is a series of processed rows that we can read easily

      .pipe(
        parse({
          // there's a few different ways of parsing CSV data.
          // For example, the comments that we use can start with various different characters.
          // It's up to whoever wrote the file.
          // So for the file to be passed correctly, we can pass in an option to our parse function by giving it
          // this object and saying that the comments character is the hashtag symbol.
          // So now we're telling it that we want to treat lines that start with this character as comments, and
          // we're going to pass in one more option, which is columns being set to true.
          // This will return. Each row in our CSV file as a JavaScript
          // object with key value pairs, rather than as just an array
          // of values in our row.

          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          console.log(data['kepler_name']);
          // habitablePlanets.push({
          //   ...data,
          //   keplerName: data.kepler_name, // Додаємо поле з правильним ключем
          // });
          // we can create, delete, find documents in our planets collection, the same json data will be save in our Mongo collection
          // mongo is responsible for storing our data not JS so it should be async
          /*
          We're creating all of these planets when they're matched as habitable every time that we call this loadPlanets data function.
          And this function is exported from our planet's model and called in our server.js when we start the server.
          So if we restart the server or run many instances of the server in, say, a cluster, we're going to
          be calling that load planet's data function many, many times and duplicating all of these documents that we create in our database.
          Luckily, Mongoose makes it easy for us to solve this problem.

          insert + update = upsert - the update part allows to insert only when the object we are tryng to insert isn't already exists.
           */
          savePlanet(data);
        }
        // results.push(data);
      })
      .on('error', (error) => {
        console.log(error);
        reject(error);
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        // console.log(`${habitablePlanets.length} habitable planets found!`);
        console.log(`${countPlanetsFound} habitable planets found!`);
        /*
        And we're not passing anything into the resolve function to be returned when our promise resolves,
        because instead we're setting this habitable planets array.
        We're just using our promise so that we know when our planet's data has been successfully loaded.
        */
        resolve();
      });
  });
}

async function getAllPlanets() {
  console.log(await planets.find({}));
  return await planets.find({}); // pass the empty object because we just need to return all plantes
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Couldn't save the planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};

/*
And Node won't wait for any of our stream code to complete before it returns,
are modules exports down here at the bottom
what to do when we need to populates our server with data on startup.
*/
