const API_URL = 'http://localhost:8000/v1';

async function httpGetPlanets() {
  try {
    const response = await fetch(`${API_URL}/planets`);
    const planets = await response.json();
    return planets;
  } catch (e) {
    console.log(e);
    throw new Error("Wasn't able to fetch planets...");
  }
  // TODO: Once API is ready.
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  try {
    const response = await fetch(`${API_URL}/launches`);
    const launches = await response.json();
    return launches.sort((a, b) => a.flightNumber - b.flightNumber);
  } catch (e) {
    console.log(e);
    throw new Error("Wasn't able to fetch launches...");
  }
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return {
      ok: false,
    };
  }

  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/:${id}`, {
      method: 'delete',
    });
    // TODO: Set success based on response.
  } catch (e) {
    console.log(e);
    return {
      ok: false,
    };
  }
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
