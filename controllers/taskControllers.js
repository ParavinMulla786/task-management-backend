const { where } = require("sequelize");
const Task = require("../models/taskModels");


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
    const task = await Task.findAll();
    res.status(200).send({
      success:true,
      task,

    });
    
  } 
  catch (error) {
  console.log("Error:", error.message);
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
  try {
    const { ID } = req.params;
    const { status } = req.body;

    const task = await Task.findByPk(ID);

    if (!task) {
      return res.status(404).send({
        success: false,
        msg: "Task not found",
      });
    }

    task.status = status;

    await task.save();

    res.status(200).send({
      success: true,
      msg: "Status Updated Successfully",
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


async function updateTask(req, res) {
  try {
      const {ID} = req.params;
      const task = await Task.findByPk(ID);
      if (!task) {
      return res.status(404).send({
        success: false,
        msg: "Task not found",
      });
    }
    await task.update(req.body);

    res.status(200).send({
      success: true,
      msg: "Task Updated Successfully",
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
};



// getcompltedtask
// getpendingtask
// getinprogresstask

// queryurl

// gettasksbystatus 
// gettasksbyselectedmonth  --- type month   monthwise





