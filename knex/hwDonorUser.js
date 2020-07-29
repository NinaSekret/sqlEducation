const faker = require("faker");

const { db, generateMany } = require("./init");

const hwDonorUser = async () => {
  const getDonorTable = await db
    .select()
    .table("donors")
    .catch(() => false);
  const getUserTable = await db
    .select()
    .table("users")
    .catch(() => false);
  const getBankTable = await db
    .select()
    .table("banks")
    .catch(() => false);
  const getEmployeeTable = await db
    .select()
    .table("employees")
    .catch(() => false);
  const getFavoriteDonorsTable = await db
    .select()
    .table("favoriteDonors")
    .catch(() => false);

  try {
    if (!getUserTable) {
      const userData = await generateMany(5, () => {
        return {
          name: faker.name.findName(),
        };
      });

      await db.schema
        .createTable("users", function (table) {
          table.increments();
          table.string("name");
        })
        .then(function () {
          return db("users").insert(userData);
        });
    }
    if (!getBankTable) {
      const bankData = await generateMany(10, () => {
        return {
          name: faker.lorem.word(),
        };
      });

      await db.schema
        .createTable("banks", function (table) {
          table.increments();
          table.string("name");
        })
        .then(function () {
          return db("banks").insert(bankData);
        });
    }
    if (!getDonorTable) {
      const donorData = await generateMany(10, () => {
        return {
          name: faker.name.findName(),
        };
      });
      await db.schema
        .createTable("donors", function (table) {
          table.increments();
          table.string("name");
          table.integer("bank_id").unsigned();
          table.foreign("bank_id").references("banks.id");
        })
        .then(function () {
          return db("donors").insert(donorData);
        });

      await db("donors").where({ id: 1 }).update({ bank_id: 4 });
      await db("donors").where({ id: 9 }).update({ bank_id: 5 });
      await db("donors").where({ id: 8 }).update({ bank_id: 2 });
      await db("donors").where({ id: 7 }).update({ bank_id: 1 });
    }

    if (!getEmployeeTable) {
      const employeeData = await generateMany(10, (i) => {
        return {
          id: i,
        };
      });
      await db.schema
        .createTable("employees", function (table) {
          table.integer("id");
          table.integer("bank_id").unsigned();
          table.foreign("bank_id").references("banks.id");
          table.integer("user_id").unsigned();
          table.foreign("user_id").references("users.id");
        })
        .then(function () {
          return db("employees").insert(employeeData);
        });

      await db("employees").where({ id: 8 }).update({ bank_id: 2 });
      await db("employees").where({ id: 9 }).update({ bank_id: 1 });
      await db("employees").where({ id: 8 }).update({ user_id: 2 });
      await db("employees").where({ id: 9 }).update({ user_id: 3 });
    }

    if (!getFavoriteDonorsTable) {
      const favoriteDonorsData = await generateMany(10, (i) => {
        return {
          id: i,
        };
      });
      await db.schema
        .createTable("favoriteDonors", function (table) {
          table.integer("id");
          table.integer("bank_id").unsigned();
          table.foreign("bank_id").references("banks.id");
          table.integer("user_id").unsigned();
          table.foreign("user_id").references("users.id");
        })
        .then(function () {
          return db("favoriteDonors").insert(favoriteDonorsData);
        });

      await db("favoriteDonors").where({ id: 5 }).update({ bank_id: 6 });
      await db("favoriteDonors").where({ id: 6 }).update({ bank_id: 7 });
      await db("favoriteDonors").where({ id: 5 }).update({ user_id: 1 });
      await db("favoriteDonors").where({ id: 6 }).update({ user_id: 3 });
      await db("favoriteDonors").where({ id: 3 }).update({ user_id: 3 });
      await db("favoriteDonors").where({ id: 3 }).update({ bank_id: 1 });
    }

    // всех пользователей вместе с их любимыми донорами
    const leftJoin = await db
      .from("users")
      .leftJoin("favoriteDonors", "users.id", "favoriteDonors.user_id")
      .select(
        "favoriteDonors.id as favoriteDonorsId",
        "users.id as userId",
        "users.name as userName"
      );

    console.log("пользователи + доноры", leftJoin);

    // всех employee с пользователями для какого-то банка ???

    // всех employee с банками
    const leftJoin2 = await db
      .from("banks")
      .leftJoin("employees", "banks.id", "employees.bank_id");

    console.log("employee с банками", leftJoin2);

    // всех юзеров с их employee и банками
    const leftJoin3 = await db
      .from("users")
      .leftJoin("employees", "users.id", "employees.user_id")
      .leftJoin("banks", "banks.id", "employees.bank_id")
      .select(
        "employees.id as employeesId",
        "banks.name as bankName",
        "users.name as userName"
      );

    console.log("юзеры с их employee и банками", leftJoin3);
    // юзеров и дополнительно количество favorite доноров пользователя (count и мб group by)
    const olol = await db
      .from("users")
      .innerJoin("favoriteDonors", "users.id", "favoriteDonors.user_id")
      .select(
        "favoriteDonors.id as favoriteDonorId",
        "users.id as usersId",
        "users.name as userName"
      );

    console.log("юзеров и дополнительно favorite доноров", olol);

    // все уникальные имена пользователей
    const uniqueName = await db.distinct().from("users").pluck("name");
    console.log("уникальные имена пользователей", uniqueName);

    // всех юзеров и отсортировать их по количеству favorite доноров

    const groupByRaw = await db
      .from("users")
      .leftJoin("favoriteDonors", "users.id", "favoriteDonors.user_id")
      .groupByRaw("user_id")
      .count("user_id")
      .orderBy([{ column: "count", order: "desc" }]);

    console.log("отсортировать по количеству favorite доноров", groupByRaw);

    // уникальные имена пользователей и количество пользователей с таким именем
    const uniqueNameWithCount = await db
      .select("name")
      .from("users")
      .groupByRaw("name")
      .count("name");

    console.log("уникальные имена + количество", uniqueNameWithCount);
  } catch (err) {
    console.log(err);
  }
};

hwDonorUser();
