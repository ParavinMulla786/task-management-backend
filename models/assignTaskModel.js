const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./userModel");
const Task = require("./taskModel");

const AssignTask = sequelize.define(
  "AssignTask",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    taskID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "task",
        key: "id",
      },
    },

    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

   
  },
  {
    tableName: "assign_tasks",
    timestamps: true,
  }
);

/* ===========================
   Direct Associations
=========================== */

// One Task -> Many Assignments
Task.hasMany(AssignTask, {
  foreignKey: "taskID",
  as: "assignments",
});

AssignTask.belongsTo(Task, {
  foreignKey: "taskID",
  as: "task",
});

// One User -> Many Assignments
User.hasMany(AssignTask, {
  foreignKey: "userID",
  as: "assignedTasks",
});

AssignTask.belongsTo(User, {
  foreignKey: "userID",
  as: "user",
});

/* ===========================
   Many-to-Many Associations
=========================== */

Task.belongsToMany(User, {
  through: AssignTask,
  foreignKey: "taskID",
  otherKey: "userID",
  as: "users",
});

User.belongsToMany(Task, {
  through: AssignTask,
  foreignKey: "userID",
  otherKey: "taskID",
  as: "tasks",
});

module.exports = AssignTask;