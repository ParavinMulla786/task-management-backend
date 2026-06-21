const AssignTask = require('../models/assignTaskModel')
const Task = require('../models/taskModel')
const User = require('../models/userModel')

async function assignTaskToUser(req, res) {
    const { taskID, userID } = req.body
    try {

        const user = await User.findByPk(userID)
        const task = await Task.findByPk(taskID)

        if (!user || !task) {
            return res.status(400).send({ msg: "task and user not found", success: false })
        }

        const newEntry = await AssignTask.create({ userID: userID, taskID: taskID })
        res.status(200).send({ msg: "Task assign successfully", success: true })

    } catch (error) {
    console.log("ERROR:", error);

    res.status(500).send({
        msg: "Server error",
        error: error.message
    });
}
    }


async function getAllAssignTable(req, res) {
    try {
        assignRecords = await AssignTask.findAll()
        res.status(200).send({ assignRecords: assignRecords, success: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Server error" })
    }
}

async function getTasksByUSer(req, res) {
    const userID = req.user.id
    try {
        const getTasks = await AssignTask.findAll({
            where:{userID:userID},
            include:[
                {
                    model:Task,
                    attributes:['id','title','startDate','endDate','status']
                }
            ]
        })
        res.status(200).send({getTasks:getTasks,success:true})

    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: "Server error" })
    }
}

async function getTaskWithUsers(req, res) {
    const taskID = req.params.TASKID;

    try {
        const assignments = await AssignTask.findAll({
            where: { taskID },
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Task,
                },
            ],
        });

        // Debug
        console.log(assignments);

        if (assignments.length === 0) {
            return res.status(404).send({
                success: false,
                msg: "No users assigned to this task",
            });
        }

        const result = {
            task: {
                id: assignments[0].Task.id,
                title: assignments[0].Task.title,
                description: assignments[0].Task.description,
                status: assignments[0].Task.status,
                startDate: assignments[0].Task.startDate,
                endDate: assignments[0].Task.endDate,
            },

            users: assignments.map((item) => ({
                id: item.User.id,
                name: item.User.name,
                email: item.User.email,
            })),
        };

        res.status(200).send({
            details: result,
            success: true,
        });

    } catch (error) {
        console.log(error);

        res.status(500).send({
            msg: "Server error",
            error: error.message,
        });
    }
}





module.exports = {
    assignTaskToUser, getAllAssignTable,
    getTasksByUSer, getTaskWithUsers
}