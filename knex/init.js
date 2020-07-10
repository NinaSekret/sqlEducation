const _ = require("lodash");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    port: "5434",
    password: "postgres",
    database: "education",
  },
});

async function generateMany(count, generate) {
  let results = [];
  let i = 0;
  const chunks = _.chunk(_.range(count), 10);

  for (const arr of chunks) {
    const promises = arr.map(async () => generate(i++));
    results = [...results, ...(await Promise.all(promises))];
  }

  return results;
}

module.exports = {
  db,
  generateMany,
};
