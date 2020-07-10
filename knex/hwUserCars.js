const faker = require("faker");
const _ = require("lodash");

const { db, generateMany } = require("./init");

const hwUserCars = async () => {
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
          table.integer("user_cars").unsigned();
          table.foreign("user_cars").references("users.id");
        })
        .then(function () {
          return db("cars").insert(carsData);
        });

      await db("cars").where({ id: 10 }).update({ user_cars: 3 });
      await db("cars").where({ id: 9 }).update({ user_cars: 2 });
      await db("cars").where({ id: 8 }).update({ user_cars: 2 });
    }

    //получение cars и users

    const cars = await db.select("*").from("cars");
    const users = await db.select("*").from("users");
    console.log("cars", cars);
    console.log("users", users);

    //удаление машины

    await db("cars").where("id", 2).del();

    //запрос на получение всех пользователей, у которых есть хотя бы 1 машина

    const join = await db
      .from("users")
      .innerJoin("cars", "users.id", "cars.user_cars");
    console.log("join", join);
  } catch (err) {
    console.log(err);
  }
};

hwUserCars();
