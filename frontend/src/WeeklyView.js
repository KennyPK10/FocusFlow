import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Container } from 'react-bootstrap';
import './css/WeeklyView.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function WeeklyView() {
  const navigate = useNavigate();
  const[tasks,setTaskList]=useState([]);
  const fetchtasks=async()=>{
    try{
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/tasks`,{},{withCredentials:true})//send user unique id
        setTaskList(res.data.tasklist);
        console.log(res.data.tasklist);
        console.log("Tasks set");
    }catch(err){
        console.log("Error retrieving tasks", err)
    }
};

useEffect(()=>{
    fetchtasks();
},[]);


  // Group tasks by day of the week
  const [weeklyTasks, setWeeklyTasks] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });

  useEffect(() => {
    // Function to get day of the week from a date
    const getDayOfWeek = (dateStr) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const date = new Date(dateStr);
      return days[date.getDay()];
    };

    // Organize tasks by day
    const tasksByDay = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    tasks.forEach(task => {
      const day = getDayOfWeek(task.Due);
      if (tasksByDay[day]) {
        tasksByDay[day].push(task);
      }
    });

    setWeeklyTasks(tasksByDay);
  }, [tasks]);


  return (
    <div className="no-padding-wrapper">
      <div className="full-width-banner no-top-margin">
        <h1 className="motto">"Plan Smart. Focus Hard. Achieve More."</h1>
      </div>
      
      <Container fluid className="p-0">
        <div className="weekly-view px-3 px-md-4">
          <h2 className="section-title">Weekly Schedule</h2>
          <Row>
            {Object.keys(weeklyTasks).map((day, index) => (
              <Col md={12} key={index} className="mb-3">
                <Card className="day-card">
                  <Card.Header className="day-header">
                    <h3>{day}</h3>
                    <Badge bg="primary">{weeklyTasks[day].length} Tasks</Badge>
                  </Card.Header>
                  <Card.Body>
                    {weeklyTasks[day].length > 0 ? (
                      <div className="day-tasks">
                        {weeklyTasks[day].map((task, idx) => (
                          <div key={idx} className="day-task-item">
                            <span className="task-name">{task.TaskName}</span>
                            <Badge 
                              bg={task.Priority === "high" ? "danger" : 
                                task.Priority === "medium" ? "warning" : "success"}
                            >
                              {task.Priority}
                            </Badge>
                            <Badge bg="info" className="ms-2">{task.EstTime}</Badge>
                            <div className="progress mt-2 mb-1">
                              <div 
                                className="progress-bar" 
                                role="progressbar" 
                                style={{ 
                                  width: `${task.CheckPoints.filter(cp => cp.done).length / task.CheckPoints.length * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-tasks">No tasks scheduled</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4 mb-4">
            <Button className="btn-back" onClick={()=>{navigate('/TaskManager')}}>
                        <i className="bi bi-arrow-left"></i> Back to Tasks
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default WeeklyView; 