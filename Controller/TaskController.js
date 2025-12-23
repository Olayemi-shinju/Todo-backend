import Task from '../Model/TaskModel.js'


export const newTask = async (req, res) => {
    try {
        const userId = req.user._id
        const { title, description, dueDate } = req.body;

        const task = await Task.create({
            title,
            description,
            dueDate,
            user: userId
        })
        res.status(201).json({ success: true, msg: 'Task created successfully', data: task })


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, msg: 'An error ocurred' })
    }
}


export const updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description } = req.body

        if (!title || !description) {
            res.status(401).json({ succsss: false, msg: 'Title and description value is required' })
        }

        const resp = await Task.findByIdAndUpdate(id, { title, description }, { new: true })
        res.status(200).json({ success: true, msg: 'Task Updated Successfully', data: resp })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, msg: 'An error ocurred' })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id
        const user = await Task.findOne({ _id: id, user: userId })
        if (!user) {
            res.status(401).json({ success: false, msg: 'Failed to delete task' })
            return
        }
        await Task.findByIdAndDelete(id)
        const task = await Task.find({ user: userId }).sort({ createdAt: -1 })

        res.status(200).json({ data: task })
    } catch (error) {
        console.log(error.message)
    }
}

export const getUserTask = async (req, res) => {
    try {
        const userId = req.user._id
        const task = await Task.find({ user: userId }).sort({ createdAt: -1 })
        const formattedTask = task.map((e) => {
            let status = 'pending';
            if (e.completed) {
                status = 'completed';
            }
            else if (e.dueDate && new Date() > e.dueDate) {
                status = 'overdue'
            }
            return {
                id: e._id,
                title: e.title,
                description: e.description,
                dueDate: e.dueDate,
                status,
            }

        })
        res.status(200).json({ success: true, msg: 'User task fetch successfully', data: formattedTask })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, msg: 'An error ocurred' })
    }
}

export const getSingleTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ success: false, msg: 'Task not found' });

        let status = "pending";
        if (task.completed) status = "completed";
        else if (task.dueDate && new Date() > task.dueDate) status = "overdue";

        res.status(200).json({
            success: true,
            msg: 'Task found successfully',
            data: {
                id: task._id,
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                status,
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: 'An error occurred' });
    }
};


export const Iscomplete = async (req, res) => {
    try {
        const userId = req.user._id;
        const { completed } = req.body;
        const { id } = req.params;

        const task = await Task.findOne({ _id: id, user: userId });
        if (!task) {
            return res.status(404).json({ success: false, msg: "Task not found" });
        }

        task.completed = completed;
        await task.save();

        let status = "pending";
        if (task.completed) status = "completed";
        else if (task.dueDate && new Date() > task.dueDate) status = "overdue";

        res.status(200).json({
            success: true,
            msg: "Task status updated successfully",
            data: {
                id: task._id,
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                status,
            }
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, msg: "An error occurred" });
    }
};
