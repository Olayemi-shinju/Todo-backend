import jwt from 'jsonwebtoken';
import User from '../Model/UserModel.js';

export const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[0]
        if (!token) {
            return res.status(401).json({success: false, msg: 'No token not authorized' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        if (!req.user) {
            return res.status(401).json({success: false, msg: 'user not found' })
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
}




