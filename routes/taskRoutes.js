const express = require('express');
const taskController = require('../controllers/taskControllers');

const router = express.Router();

router.post('/create', taskController.createTask);
router.get('/getAll', taskController.getAllTasks);
router.get('/getTask/:ID', taskController.getTaskByID);
router.patch('/updateStatus/:ID', taskController.updateStatus);
router.put('/updateTask/:ID', taskController.updateTask);
router.delete('/deleteTask/:ID', taskController.deleteTask);

module.exports = router;