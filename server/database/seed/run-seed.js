const seed = require("../seed/seed-users.js");
const devData = require("../data/dev-data/index.js");
const mongoose = require("mongoose");

const runSeed = () => {
  return seed(devData).then(() => mongoose.disconnect());
};

runSeed();