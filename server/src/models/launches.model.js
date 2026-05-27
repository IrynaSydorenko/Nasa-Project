const launchesDatabase = require('./launches.mongo');
const axios = require('axios');
const planets = require('./planets.mongo');

// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

// let latestFlightNumber = 100;

// const launch = {
//   flightNumber: 100, // just setted it as a unique id //flight_number
//   mission: 'Kepler exploration X', // mission(name)
//   rocket: 'Explorer IS1', //rocket.name
//   launchDate: new Date('December 27, 2030'), //date_local
//   target: 'Kepler-442 b', //not applicableв
//   customers: ['ZTM', 'NASA'], //payload.customers for each payload
//   upcoming: true, //upcoming
//   success: true, //success
// };

// saveLaunch(launch);
// launches.set(launch.flightNumber, launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('problem downloading the launch data');

    throw new Error('Launch download data faild');
  }

  // console.log(response.data.docs);
  const launchDocs = response.data.docs; //And taking the data property from that response, which is where Axios puts the body of the response from the server
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => payload['customers']);

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      // target: '', //not applicable
      // customers: customers, //payload.customers for each payload
      customers, // shorthand of customers: customers
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    // TODO: populate launches collection
    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('Launch data already loaded!');
  } else {
    await populateLaunches();
  }
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 }) //-1 for descending values and 1 for ascending values
    .skip(skip)
    .limit(limit);
  // Mongoose and MongoDB allow you to chain a limit() function onto your find().
  /*
    Now for the page, there's no direct function that we can use in MongoDB out of the box.
    But we have something very close. We're going to use this dot skip function right before our limit, 
    which skips over the first 10 documents if you pass in the number 10 or 20, if you pass in 20, in this case, we'll return the 50 documents
    after we've skipped the first 20. With just a little bit of math we can turn this skip() function combined with our limits into a reusable way of implementing pagination
    using purely built in Mongo and MongoDB features.
  */
}

async function saveLaunch(launch) {
  // const planet = await planets.findOne({ keplerName: launch.target });

  // if (!planet) {
  //   throw new Error('No matching planet was found!');
  // }

  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       castomers: ['Zero to Mastery', 'NASA'],
//       flightNumber: latestFlightNumber,
//     })
//   );
// }

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    // Here in a lower layer in our API, not where we have an axess to req and res,
    // we can return error by either return invalid objects like null or undefined
    // either preferably throw error

    throw new Error(`No matching planet found`);
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
  //filter object that we can use when we query mongo
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  // return await launchesDatabase.findOne({ flightNumber: launchId });
  return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestlaunch = await launchesDatabase.findOne().sort('-flightNumber');
  // Passing in the property will sort the documents,
  // buy that property in ascending order from lowest to highest , and what find one will do is it will return.
  // The first document, if there's more than one, that's returned.
  // So we're taking all of the launches, we're sorting them and then we're taking the first one in the
  // list that's returned, which means to get the latest launch, we need to sort in descending order from
  // highest flight number to lowest, which luckily is a matter of just adding this minus in front of the
  // property name
  if (!latestlaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestlaunch.flightNumber;
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  // return aborted.ok === 1 && aborted.nModified === 1; //amount of documents that were updated are exactly one
  return aborted.modifiedCount === 1;
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
}

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  // addNewLaunch,
  existsLaunchWithId,
  scheduleNewLaunch,
  abortLaunchById,
};
