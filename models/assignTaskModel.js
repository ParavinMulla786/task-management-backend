const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = require("./taskModel");
const User = require("./userModel");


const AssignTask = sequelize.define(
    "AssignTask",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        taskID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"task",
                key:"id"
            }
        },
        userID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"users",
                key:"id"
            }
        },

    },
    {tableName: "assign_tasks",
    timestamps: true,}

)


// One user can have many assigned tasks
    User.hasMany(AssignTask, {foreignKey:"userID"})
    AssignTask.belongsTo(User, {foreignKey:"userID"})

// One task can be assigned to many users
    Task.hasMany(AssignTask, {foreignKey:"taskID"})
    AssignTask.belongsTo(Task,{foreignKey:"taskID"})



module.exports =AssignTask