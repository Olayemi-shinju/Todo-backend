import express, { Router } from 'express'
const router = express.Router()
import { newTask, getSingleTask, getUserTask, deleteTask, updateTask, Iscomplete } from '../Controller/TaskController.js'
import { protect } from '../Middleware/auth.js'
router.post('/create-task', protect, newTask);
router.get('/getUserTask', protect, getUserTask);
router.get('/getSingleTask/:id', protect, getSingleTask);
router.delete('/delete-task/:id', protect, deleteTask);
router.put('/update-task/:id', protect, updateTask);
router.patch('/update-status/:id', protect, Iscomplete)

export default router
