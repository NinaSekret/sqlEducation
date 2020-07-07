const faker = require("faker");
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

const mainFunc = async () => {
  const getUserTable = await db
    .select()
    .table("users")
    .catch(() => false);
  const getCarsTable = await db
    .select()
    .table("cars")
    .catch(() => false);

  try {
    if (!getUserTable) {
      const userData = await generateMany(5, () => {
        return {
          name: faker.name.findName(),
          email: faker.internet.email(),
          created_at: new Date(),
        };
      });

      await db.schema
        .createTable("users", function (table) {
          table.increments();
          table.string("name");
          table.string("email");
          table.timestamps();
        })
        .then(function () {
          return db("users").insert(userData);
        });
    }
    if (!getCarsTable) {
      const carsData = await generateMany(10, () => {
        return {
          name: faker.lorem.word(),
          price: faker.commerce.price(),
          created_at: new Date(),
        };
      });
      await db.schema
        .createTable("cars", function (table) {
          table.increments();
          table.string("name");
          table.float("price");
          table.timestamps();
        })
        .then(function () {
          return db("cars").insert(carsData);
        });
    }
  } catch (err) {
    console.log(err);
  }
};

mainFunc();

async function generateMany(count, generate) {
  let results = [];
  let i = 0;
  const chunks = _.chunk(_.range(count), 10);
  console.log("count", _.range(count));

  for (const arr of chunks) {
    console.log("arr", arr);
    const promises = arr.map(async () => generate(i++));
    results = [...results, ...(await Promise.all(promises))];
  }

  return results;
}
