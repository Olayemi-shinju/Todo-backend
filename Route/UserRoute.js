import express from "express";
import { Signup, login, UpdateUser, deleteUser, getSingleUser } from "../Controller/UserController.js";
import { protect } from "../Middleware/auth.js";
const router = express.Router()
router.post('/register', Signup)
router.post('/login', login)
router.put('/update/:id', protect, UpdateUser)
router.delete('/delete/:id', deleteUser)
router.get('/getSingleUser/:id', getSingleUser)



export default router
