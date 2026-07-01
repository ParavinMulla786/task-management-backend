const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      defaultValue: "Medium",
    },

    status: {
      type: DataTypes.ENUM(
        "Pending",
        "In Progress",
        "Completed"
      ),
      defaultValue: "Pending",
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "task",
    timestamps: true,
  }
);

module.exports = Task;