const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  target: {
    type: String,
    // required: true,
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});

// This first argument here should always be the singular name of the collection that this model represents.
// Mongoose will then take what you pass in lower case it make it plural and talk to the collection with that lowercase plurals name.
// Connects launchesSchema with the "Launches" collections.
// When a model is set to use a schema like this, Mongoose calls this statement compiling the model.

// But basically what we've done is we've created an object which will now allow us to create and read
// documents in our launches collection.

module.exports = mongoose.model('Launch', launchesSchema);
