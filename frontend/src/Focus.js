import React, { useEffect, useState, useRef } from "react";
import { Button, Form, ProgressBar } from "react-bootstrap";
import "./css/Focus.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function FocusPage() {
  const navigate = useNavigate();
  const { tid } = useParams();

  const [task, setTask] = useState({});
  const [checkpoints, setCheckpoints] = useState([]);
  const [time, setTime] = useState(30); // dropdown value (minutes)
  const [secondsLeft, setSecondsLeft] = useState(0); // actual time left
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Fetch task details
  useEffect(() => {
    const fetchsingletask = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/viewtask`,
          { tid },
          { withCredentials: true }
        );
        setTask(res.data);
        setCheckpoints(res.data.CheckPoints || []);
      } catch (err) {
        console.log("Error in fetching", err);
      }
    };
    fetchsingletask();
  }, [tid]);

  // Timer effect
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, secondsLeft]);

  // Controls
  const startFocus = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(time * 60); // start fresh
    }
    setIsRunning(true);
  };

  const pauseFocus = () => {
    setIsRunning(false);
  };

  const resetFocus = () => {
    setIsRunning(false);
    setSecondsLeft(0);
  };

  const toggleCheckpoint = (index) => {
    const updated = [...checkpoints];
    updated[index].done = !updated[index].done;
    setCheckpoints(updated);
  };

  const completed = checkpoints.filter((c) => c.done).length;
  const total = checkpoints.length;
  const progressed = total ? Math.round((completed / total) * 100) : 0;
  const allDone = completed === total;

  

  const goBack = () => {
    const completedCount = checkpoints.filter((c) => c.done).length;
    const totalCount = checkpoints.length;
    const isAllDone = completedCount === totalCount;
    const updatedTask = {
      ...task,
      CheckPoints: checkpoints,
      Status: isAllDone?"completed":"pending"
    };
    try{
      axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/updatetask`,
        { updatedTask, tid },
        { withCredentials: true }
      ).then(()=>{
        navigate(`/DetailedView/${tid}`);
      });
    }catch(err){
      console.log(err)
    }
  };

  const formatTime = () => {
    const min = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const sec = (secondsLeft % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="focus-container">
       <Button className="btn-back ms-2 mt-2" onClick={goBack}>
          <i className="bi bi-arrow-left"></i> Back to Tasks
        </Button>
      <div className="focus-header">
        <h1 className="text-disp">Focus Mode</h1>
        <h3 className="text-disp">{task.TaskName || ""}</h3>
      </div>

      <div className="focus-timer">
        <h1 className="timer-display">{formatTime()}</h1>
        <div className="timer-controls">
          <Form.Select
            onChange={(e) => setTime(Number(e.target.value))}
            disabled={isRunning || secondsLeft > 0}
            className="time-select"
            value={time}
          >
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={25}>25 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
          </Form.Select>
          <div className="timer-buttons mt-3">
            <Button
              variant="success"
              onClick={startFocus}
              disabled={isRunning}
            >
              {secondsLeft > 0 ? "Resume" : "Start"}
            </Button>{" "}
            <Button
              variant="warning"
              onClick={pauseFocus}
              disabled={!isRunning}
            >
              Pause
            </Button>{" "}
            <Button variant="danger" onClick={resetFocus}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="checkpoints-section">
        <h5 className="mb-2">Checkpoints</h5>
        <ProgressBar striped variant="success" now={progressed} className="mb-3" />
        {checkpoints.map((cp, index) => (
          <Form.Check
            key={index}
            type="checkbox"
            label={cp.label}
            checked={cp.done}
            onChange={() => toggleCheckpoint(index)}
            className="mb-2"
          />
        ))}
        <div className="mt-4 text-center">
          <Button variant="primary" onClick={goBack}>
            {allDone?"Complete Task":"Update Task"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FocusPage;
