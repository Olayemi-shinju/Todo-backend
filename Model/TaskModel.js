import mongoose from "mongoose";
const schema = mongoose.Schema


const TaskSchema = new schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    completed: {type: Boolean, default: false},
    dueDate: {type: Date, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true})

export default mongoose.model('Task', TaskSchema)