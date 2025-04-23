import React, { useState, useEffect } from "react";
import { Badge, Button, Form, ProgressBar } from "react-bootstrap";
import './css/DetailedView.css';
import TaskForm from "./components/TaskForm";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function DetailedView() {
  const navigate=useNavigate();
  const {tid}=useParams();
  const [task,setTask]=useState({});
  const fetchsingletask=async()=>{
    try{    
      console.log(tid);
      const res=await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/viewtask`,{tid},{withCredentials:true});
      setTask(res.data);
      setCheckpoints(res.data.CheckPoints);
      console.log(res.data);
    }catch(err){
      console.log(err);
    }
  };

  useEffect(()=>{
    try{
      fetchsingletask();
    }catch(err){
      console.log("Error in fetching",err);
    }
  },[])

  const [checkpoints, setCheckpoints] = useState(task?.CheckPoints || []);
  const [completedPercent, setCompletedPercent] = useState(0);
  const[showModal,setshowModal]=useState(false);

  useEffect(() => {
    const completed = checkpoints.filter((cp) => cp.done).length;
    const total = checkpoints.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    setCompletedPercent(percent);
  }, [checkpoints]);

  const toggleCheckpoint = (index) => {
    const updated = [...checkpoints];
    updated[index].done = !updated[index].done;
    setCheckpoints(updated);
  };

  const update=async()=>{
    const completedCount = checkpoints.filter((cp) => cp.done).length;
  const totalCount = checkpoints.length;
  const isAllDone = completedCount === totalCount;

  const updatedTask = {
    ...task,
    CheckPoints: checkpoints,
    Status: isAllDone ? "completed" : "pending"
  };
  const res = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/api/updatetask`,
    { updatedTask, tid },
    { withCredentials: true }
  );
  console.log(res.data);
    console.log(res.data);
  };
  const handleSave = async (updatedTask) => {
    try {
       
        // Edit mode
        const tid=updatedTask._id;
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/updatetask`, {updatedTask,tid},{withCredentials:true});        
        setshowModal(false);
        fetchsingletask();
    } catch (err) {
        console.log("Error saving task", err);
    }
  };

  const handleComplete = async() => {
    try{
      const updatedTask={...task,"Status":"completed"};
      const res=await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/updatetask`,{updatedTask,tid},{withCredentials:true});
      console.log(res.data);
      navigate('/TaskManager');
    }catch(err){
      console.log(err);
    }
  }

  const goBack=()=>{
    update();
    navigate('/TaskManager');
  };
  
  const goFocus=()=>{
    update();
    navigate(`/Focus/${tid}`);
  }


  if (!task) return <div>No task selected</div>;

  return (
    <>
    <div className="detailed-view p-4">
      
      <div className="task-header mb-4">
        <div className="action-bar mb-4">
          <Button className="btn-back" onClick={goBack}>
            <i className="bi bi-arrow-left"></i> Back to Tasks
          </Button>
          <Button className="btn-focus" onClick={goFocus}>
            <i className="bi bi-stopwatch"></i> Focus on this Task
          </Button>
        </div>
        <h1 className="task-title">{task.TaskName}</h1>
        <Badge bg={
          task.Priority === "high" ? "danger" :
          task.Priority === "medium" ? "warning" : "success"
        } className="badge-text">
          {task.Priority} Priority
        </Badge>
        <p className="task-meta mt-4">
          <span className="due-date">Due on: {new Date(task.Due).toLocaleDateString()}</span>
          <span className="est-time ms-3">Estimated: {task.EstTime}</span>
        </p>
      </div>

      <div className="task-description mb-2">
        <div className="first-div"><h4>Goal </h4></div>
        <div className="second-div"><p> {task.Aim}</p></div>
      </div>

      <div className="task-progress m-4 p-3">
        <div className="progress-header d-flex justify-content-between">
          <h4>Progress</h4>
          <span className="percent-complete">{completedPercent}% Complete</span>
        </div>
        <ProgressBar striped variant="success" now={completedPercent} />
      </div>

      <div className="d-flex flex-column checkpoints-container mb-4">
        <h4>Checkpoints</h4>
        {checkpoints.map((cp, index) => (
          <Form.Check
            key={index}
            type="checkbox"
            label={cp.label}
            checked={cp.done}
            onChange={() => toggleCheckpoint(index)}
            className="mb-2 checkpoint-item"
          />
        ))}
      </div>

      {task.Comments && (
        <div className="comments-container mb-4">
          <h4>Notes</h4>
          <p className="task-comments">{task.Comments}</p>
        </div>
      )}

      <div className="action-buttons mt-4">
        <Button variant="primary" className="me-2" onClick={()=>{setshowModal(true)}}>
          <i className="bi bi-pencil"></i> Edit Task
        </Button>
        {completedPercent === 100 && (
          <Button variant="success" onClick={()=>{handleComplete()}}>
            <i className="bi bi-check-circle"></i> Mark as Completed
          </Button>
        )}
        {showModal && (
          <TaskForm
                show={showModal}
                onHide={() => {setshowModal(false)}}
                onSave={handleSave}
                existingTask={task}
            />
        )}
      </div>
    </div>
    
    </>
  );
}

export default DetailedView;
