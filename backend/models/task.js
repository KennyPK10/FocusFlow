const mongoose = require("mongoose");

const taskSchema=new mongoose.Schema({
    Tid: Number,
    TaskName: String,
    Aim: String,
    Priority: String,
    Due:  { type: Date, required: true },
    EstTime: String,
    CheckPoints: [
        {
        label: String,
        done: Boolean
        }
    ],
    Status: String,
    Comments: String,
    UserID: {type: mongoose.SchemaTypes.ObjectId, ref: 'user'}
});

module.exports=mongoose.model('Task',taskSchema);