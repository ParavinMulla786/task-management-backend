const express = require('express')
const {assignTaskToUser,getTasksByUSer, getAllAssignTable,getTaskWithUsers} = require('../controllers/assignTaskController')
const {auth,admin} = require('../middleware/auth')
const router = express.Router()

router.post('/assign-task', auth, admin, assignTaskToUser)
router.get('/getAllAssignTable',auth, admin,  getAllAssignTable)
router.get('/get-tasks-by-user',auth, getTasksByUSer)
router.get('/getTaskWithUsers/:TASKID',auth, getTaskWithUsers)



module.exports = router