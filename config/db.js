require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database Connected Successfully");

    await sequelize.sync({ alter: true });
    console.log("Models Synchronized Successfully");
  } catch (error) {
    console.log("Database connection error:", error);
  }
}

connectDB();

module.exports = sequelize;