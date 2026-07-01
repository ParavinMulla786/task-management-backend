const { where } = require("sequelize");
const Task = require("../models/taskModel");

const AssignTask = require("../models/assignTaskModel");
const User = require("../models/userModel");
async function createTask(req, res) {
  try {
    const { title, description, startDate, endDate } = req.body;

    if (!title || !description || !startDate || !endDate) {
      return res.status(400).send({
        success: false,
        msg: "All fields are required",
      });
    }

   
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).send({
        success: false,
        msg: "End Date should be greater than Start Date",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      startDate,
      endDate,
    });

    res.status(201).send({
      success: true,
      msg: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
}

async function getAllTasks(req, res) {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: AssignTask,
          as: "assignments",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    res.status(200).send({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: error.message,
    });
  }
}

async function getTaskByID(req, res) {
  try {
    const { ID } = req.params;

    const task = await Task.findByPk(ID);

    if (!task) {
      return res.status(404).send({
        success: false,
        msg: "Task not found",
      });
    }

    res.status(200).send({
      success: true,
      task,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
}


async function updateStatus(req, res) {
  const ID = req.params.ID
        const status = req.body.status
    try {
        statuArr = ["Pending", "Inprogress", "Completed"]
        if(!statuArr.includes(status)){
            return res.status(400).send({msg:"Data not found",success:false})
        }
        const taskForStatusUpdate = await Task.findByPk(ID)
        // console.log(taskForStatusUpdate)
        if(!taskForStatusUpdate){
            return res.status(400).send({msg:"Task not found", success:false})
        }

        await taskForStatusUpdate.update({status:status})
        res.status(200).send({msg:"Task status updated successfully"})


    } catch (error) {
        console.log(error)
        res.status(500).send({msg:"Server error"})
    }
}


async function updateTask(req, res) {
    const ID = req.params.ID;

    try {
        const taskForUpdate = await Task.findByPk(ID);

        if (!taskForUpdate) {
            return res.status(400).send({
                msg: "Task not found",
                success: false
            });
        }

        // Get updated values or keep existing ones
        const startDate = req.body.startDate || taskForUpdate.startDate;
        const endDate = req.body.endDate || taskForUpdate.endDate;

        // Validate dates
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).send({
                msg: "Start date cannot be greater than end date",
                success: false
            });
        }

        await taskForUpdate.update({
            title: req.body.title || taskForUpdate.title,
            description: req.body.description || taskForUpdate.description,
            startDate,
            endDate
        });

        res.status(200).send({
            msg: "Task updated successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Server error"
        });
    }
}

async function deleteTask(req, res) {
  try {
    const { ID } = req.params;

    const task = await Task.findByPk(ID);

    if (!task) {
      return res.status(404).send({
        success: false,
        msg: "Task Not Found",
      });
    }

    await task.destroy();

    res.status(200).send({
      success: true,
      msg: "Task Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
}


async function getcompltedtask(req, res) {
  try {
    
   const task =  await Task.findAll({where:{status:"Completed"}});

    res.status(200).send({
      success: true,
      msg:"All Completed Task",
      data:task,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
}
async function getpendingtask(req, res) {
  try {
    
   const task =  await Task.findAll({where:{status:"Pending"}});

    res.status(200).send({
      success: true,
      msg:"All Pending Task",
      data:task,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
}


async function getinprogresstask(req, res) {
  try {
    
   const task =  await Task.findAll({where:{status:"Inprogress"}});

    res.status(200).send({
      success: true,
      msg:"All InProgress Task",
      data:task,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
}

async function gettasksbystatus(req, res) {
  try {
    const {status} = req.query;
   const task =  await Task.findAll({where:{status}});


   const validstatus = ["Pending" , "InProgress", "Completed"];


   if(!validstatus.includes(status)){
    res.status(404).send({
      msg:"Invalid Status",
    })
      
   }


   

    res.status(200).send({
      success: true,
      msg:"All InProgress Task",
      data:task,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
}



async function gettasksbyselectedmonth(req, res) {
  try {
    const { month } = req.query;

    if (!month || Number(month) < 1 || Number(month) > 12) {
      return res.status(400).send({
        success: false,
        msg: "Please provide a valid month (1-12)",
      });
    }

    const tasks = await Task.findAll();

    const monthWiseTasks = tasks.filter((task) => {
      const taskMonth = new Date(task.startDate).getMonth() + 1;
      return taskMonth === Number(month);
    });

    res.status(200).send({
      success: true,
      msg: `Tasks for month ${month}`,
      data: monthWiseTasks,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: error.message,
    });
  }
}


module.exports = {
  createTask,
  getAllTasks,
  getTaskByID,
  updateStatus,
  updateTask,
  deleteTask,
  getcompltedtask,
  getpendingtask,
  getinprogresstask,
  gettasksbystatus,
  gettasksbyselectedmonth,
};



// getcompltedtask
// getpendingtask
// getinprogresstask



// gettasksbystatus 
// gettasksbyselectedmonth  --- type month   monthwise