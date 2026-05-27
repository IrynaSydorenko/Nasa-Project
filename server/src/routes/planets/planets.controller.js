const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res) {
  //  Now, this status code here is optional because Express returns 200 by default, but I'm adding here,
  // so we remember to set the status code appropriately for all of our responses.
  // And you might see some express code that returns.
  // Whenever it sets the response, this is just to make sure that our controller functions only ever set
  // the response once, because if you remember when we try to respond multiple times, Express will complain
  // about the headers already being set because once you set the response, it's locked in.
  // So the return value of our controller functions isn't used by Express.
  // We're just using the return to make sure that our function stops executing and only one response is
  // ever set.

  return res.status(200).json(await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
