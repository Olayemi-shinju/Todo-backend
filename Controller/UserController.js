import User from "../Model/UserModel.js";
import jwt from "jsonwebtoken";

// REGISTER
export const Signup = async (req, res) => {
    try {
        const { name, password, phone, email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                msg: "Email already exists"
            });
        }
        const user = await User.create({
            name,
            password,
            phone,
            email
        });

        const userData = user.toObject()
        delete userData.password

        return res.status(201).json({
            success: true,
            msg: "User created successfully",
            data: userData
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "This user does not exist"
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                msg: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            msg: "Login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message
        });
    }
};

export const UpdateUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const { id } = req.params;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, phone },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            msg: 'Profile updated successfully',
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: error.message });
    }
};

export const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' })

        res.status(200).json({ success: true, msg: 'User found successfuly', data: user })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, msg: 'An error occured' })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ success: false, msg: 'User not found' })
        } else {
            await User.findByIdAndDelete(id)
            const resp = await User.find()
            res.status(200).json({ resp })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, msg: 'An error ocurred' })
    }
}