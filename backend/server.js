const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const helmet = require("helmet")
const ratelimit = require("express-rate-limit");
const { check , validationResult } = require("express-validator");

const mongoose = require("mongoose");
const user=require('./models/users');
const task=require('./models/task');

require('dotenv').config();

const app = express();
app.set('trust proxy', 1); // trust first proxy (for render.com HTTPS)
app.disable('x-powered-by');
app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL, // your frontend URL
    credentials: true // this is crucial for cookies
}));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const sanitize = obj => {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]); // recurse
      }
      if (key.includes('$') || key.includes('.')) {
        const cleanKey = key.replace(/\$/g, '_').replace(/\./g, '_');
        obj[cleanKey] = obj[key];
        delete obj[key];
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  next();
});


const port = process.env.SERVER_PORT;

let limiter = ratelimit({
  max: 100,
  windowms: 1000*60*30,
  message: "Received too many requests, please try after sometime"
});

app.use('/api',limiter);

mongoose.connect(process.env.DB_URL)
  .then(() => {console.log("MongoDB connected");
    updateOverdueTasks();
  })
  .catch((err) => console.error("MongoDB connection error", err));

async function updateOverdueTasks() {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const result = await task.updateMany(
      {
        Status: 'pending',
        Due: {$lt:todayStr} // String comparison works for "YYYY-MM-DD" format
      },
      { $set: { Status: 'pastdue' } }
    );

    console.log("tasks updated to past-due ", result);
  } catch (err) {
    console.error('Error updating overdue tasks:', err);
  }
}

function isLoggedIn(req, res, next){
    try{
    console.log("printing for:",req.cookies.StudyPlannerCookie);
    let token=req.cookies.StudyPlannerCookie;
    console.log("Printing from islogged in",token);
    if(token){
        let valid=jwt.verify(token,process.env.JWT_SECRET);
        if(valid){
            req.user=valid;//this will be passed on to all fns having it through which decoded cookie info can be used there
            console.log("req.use",req.user);
            next();
        }
        else{
            console.log("invalid token");
            res.status(401).json("invalid token");
        }
    }
    else{
        res.status(401).json("no token");
    }
    }catch(err){
        res.status(403).json("JWT authentication and verification failed");
    }
};

app.post('/api/login', [
  check('email').isEmail().withMessage("Enter a valid email"),
  check('password').isLength({min:8}).withMessage("Enter a valid password")
  ],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()) return res.status(422).json({'errors':errors.array()});
    try{
        console.log(req.body);
        const {email, password}=req.body;
        const currUser=await user.findOne({email: email});
        if(currUser){
            const valid= await bcrypt.compare(password,currUser.password);
            if(valid){
                const token= await jwt.sign({UserID:currUser._id},process.env.JWT_SECRET,{expiresIn:'2h'});
                console.log(token)
                res.cookie("StudyPlannerCookie",token, {
                    httpOnly: true,
                    sameSite: process.env.NODE_ENV === 'production'? 'None' : 'Lax', // or 'None' if using https
                    secure: process.env.NODE_ENV === 'production'? true : false     // true only for https
                });
                console.log("Cookie set");
                res.status(200).json({comment:'Valid Credentials entered',u_id: currUser._id});
            }
            else{
                res.status(400).json({comment:'Enter valid credentials here',u_id: null});
            }
        }else{
            res.status(404).json({comment:'Enter valid credentials here',u_id: null});
        }
        console.log(currUser);
    }catch(error){
        console.log("Error:",error);
    }
});

app.post('/api/register', [
    check('email').isEmail().withMessage("Enter a valid email"),
    check('password').isLength({min:8}).withMessage("Enter a valid password")
  ] ,async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()) return res.status(422).json({'errors':errors.array()});
    try{
        console.log(req.body);
        const {email, password}=req.body;
        const existUser=await user.findOne({email: email});
        if( !existUser ){
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new user({ email, password: hashedPassword });
            await newUser.save();
            res.status(201).json({comment:'User Registered',ok:1});
        }
        else{
            res.status(409).json({comment:'User already exists',ok:0});
        }
        console.log(req.body);
    }catch(error){
        console.log("error:",error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/api/tasks', isLoggedIn, async (req, res) => {
    try {
      const user_obj_id = new mongoose.Types.ObjectId(req.user.UserID);
      const TaskList = await task.find({ UserID: user_obj_id });
      res.status(200).json({ tasklist: TaskList });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });
  
  app.post('/api/createtasks', isLoggedIn, async (req, res) => {
    try {
      const { updatedTask } = req.body;
      const user_obj_id = new mongoose.Types.ObjectId(req.user.UserID);
      updatedTask.UserID = user_obj_id;
  
      const newTask = new task(updatedTask);
      await newTask.save();
      res.status(201).json({ message: "Task saved in DB" });
    } catch (err) {
      console.error("Error creating task:", err);
      res.status(500).json({ error: "Failed to create task" });
    }
  });
  
  app.delete('/api/deletetask', isLoggedIn, async (req, res) => {
    try {
      const user_obj_id = new mongoose.Types.ObjectId(req.user.UserID);
      const { Task } = req.body;
  
      const tid = new mongoose.Types.ObjectId(Task._id);
      const result = await task.deleteOne({ _id: tid, UserID: user_obj_id });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Task not found or unauthorized" });
      }
  
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
      console.error("Error deleting task:", err);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });
  
  app.post('/api/viewtask', isLoggedIn, async (req, res) => {
    try {
      const user_obj_id = new mongoose.Types.ObjectId(req.user.UserID);
      const { tid } = req.body;
  
      const tidd = new mongoose.Types.ObjectId(tid);
      const Taskk = await task.findOne({ _id: tidd, UserID: user_obj_id });
  
      if (!Taskk) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      res.status(200).json(Taskk);
    } catch (err) {
      console.error("Error viewing task:", err);
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });
  
  app.post('/api/updatetask', isLoggedIn, async (req, res) => {
    try {
      const user_obj_id = new mongoose.Types.ObjectId(req.user.UserID);
      const { updatedTask, tid } = req.body;
  
      const tidd = new mongoose.Types.ObjectId(tid);
      const result = await task.replaceOne({ _id: tidd, UserID: user_obj_id }, updatedTask);
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "Task not found or not updated" });
      }
  
      res.status(200).json({ message: "Task updated successfully" });
    } catch (err) {
      console.error("Error updating task:", err);
      res.status(500).json({ error: "Failed to update task" });
    }
  });
  
  app.post('/api/logout', isLoggedIn, (req, res) => {
    try {
      res.clearCookie("StudyPlannerCookie", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        secure: process.env.NODE_ENV === 'production'
      });
      console.log("Cookie cleared");
      res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      console.error("Error logging out:", err);
      res.status(500).json({ error: "Logout failed" });
    }
  });
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ error: "Something broke on the server." });
 });
  
