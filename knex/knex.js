const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost:5434",
    user: "postgres",
    password: "postgres",
    database: "education",
  },
});

knex.schema.createTable("users", function (table) {
  table.increments();
  table.string("name");
  table.string("email");
  table.timestamps();
});
