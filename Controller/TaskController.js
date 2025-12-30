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
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(dueDate);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({
          success: false,
          msg: "Updated date cannot be in the past",
        });
      }
    }

    const resp = await Task.findByIdAndUpdate(
      id,
      { title, description, dueDate, completed: false },
      { new: true }
    );

    if (!resp) {
      return res.status(404).json({
        success: false,
        msg: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Task updated successfully",
      data: resp,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      msg: "An error occurred",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const taskExists = await Task.findOne({ _id: id, user: userId });
    if (!taskExists) {
      return res
        .status(404)
        .json({ success: false, msg: "Task not found" });
    }

    await Task.findByIdAndDelete(id);

    const tasks = await Task.find({ user: userId }).sort({
      createdAt: -1,
    });

    const tasksWithStatus = tasks.map((task) => {
      let status = "pending";

      if (task.completed) status = "completed";
      else if (task.dueDate && new Date() > task.dueDate)
        status = "overdue";

      return {
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completed: task.completed,
        status,
      };
    });

    res.status(200).json({
      success: true,
      data: tasksWithStatus,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      msg: "Failed to delete task",
    });
  }
};

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

    // Ensure completed is boolean
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        msg: "completed must be true or false",
      });
    }

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        msg: "Task not found",
      });
    }

    // Update completed field
    task.completed = completed;
    await task.save();

    // Derive status
    let status = "pending";
    if (task.completed) status = "completed";
    else if (task.dueDate && new Date() > task.dueDate) status = "overdue";

    return res.status(200).json({
      success: true,
      msg: "Task status updated successfully",
      data: {
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completed: task.completed, // 👈 IMPORTANT
        status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "An error occurred",
    });
  }
};

