import { Button, Container, Dropdown } from "react-bootstrap";
import TaskCard from "./components/TaskCard";
import './css/TaskManager.css'
import React, { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import { Nav } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
//import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TaskManager(){
//from database get info about all tasks which are pending,past-due,completed as different arrays
//then call task card prop and run it in a loop to display all

const navigate=useNavigate();
const[showModal,setshowModal]=useState(false);
const[taskList,setTaskList]=useState([]);
const [taskToEdit, setTaskToEdit] = useState(null);


const fetchtasks=async()=>{
    try{
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/tasks`,{},{withCredentials:true})//send user unique id through cookie
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

const handleEdit = (task) => {
    setTaskToEdit(task); // pre-fill form
    setshowModal(true);  // show modal
};

const handleDelete= async (Task) => {
    try{
        const res= await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/deletetask`,{data:{Task},withCredentials:true});
        fetchtasks();
    }
   catch(error){
        alert(error)
   }
};


const total_t=taskList.length;
const pending_t=taskList.filter(t => t.Status==='pending').length;
const completed_t=taskList.filter(t => t.Status==='completed').length;
const pastdue_t=taskList.filter(t => t.Status==='pastdue').length;

const handleSave = async (updatedTask) => {
    try {
        if (taskToEdit) {
            // Edit mode
            const tid=updatedTask._id;
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/updatetask`, {updatedTask,tid},{withCredentials:true});
        } else {
            // Create mode
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/createtasks`, { updatedTask },{withCredentials:true});
        }
        setshowModal(false);
        setTaskToEdit(null);
        fetchtasks();
    } catch (err) {
        console.log("Error saving task", err);
    }
};

const handleLogout=async ()=>{
    /*reroute to login page*/
    const res=await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/logout`,{},{withCredentials:true});
    console.log(res.data);
    if(res.status===200){
        navigate('/');
    };
}
    return(
        <>
            
                <Navbar className=" custom-navbar" sticky="top" style={{background:"white"}}>
                <Container>
                    <div className="d-flex justify-content-between align-items-center w-100">
                    <Navbar.Brand href="#home" className="brand-text">FocusFlow</Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    
                    <Navbar.Collapse id="basic-navbar-nav" className="d-flex flex-grow-1 justify-content-center align-items-center gap-2">
                        <Nav.Link href="#home" className="nav-btn">Home</Nav.Link>
                        <Nav.Link href="#pending" className="nav-btn">Pending</Nav.Link>
                        <Nav.Link href="#past-due" className="nav-btn">Past-Due</Nav.Link>
                        <Nav.Link href="#completed" className="nav-btn">Completed</Nav.Link>
                        <Nav.Link onClick={()=>{navigate('/WeeklyView')}} className="nav-btn">weekly</Nav.Link>
                    </Navbar.Collapse>

                    <div className="d-flex align-items-center gap-3">
                        <Button onClick={() => setshowModal(true)} id="create-btn">
                        +Create Task
                        </Button>

                        <Dropdown align="end">
                        <Dropdown.Toggle id="dropdown-user" variant="outline-secondary" className="ditem">
                            <i className="bi bi-person-circle" style={{ fontSize: '20px' }}></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleLogout} className="ditem">Log-out</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    </div>
                </Container>
                </Navbar>

                <div id="home" className="home d-flex flex-column justify-content-center align-items-center text-align-center"> 
                    {/* have a title task manager in the middle, have a button like compose in google drive for create task at right corner*/}
                    {/* have a search bar to search tasks by name and display all of it, filter and sort as well */}
                    <h1 className="m-5 p-5" >“Plan Smart. Focus Hard. Achieve More.”</h1>
                </div>
                <div className="d-flex dashboard justify-content-center align-item-center m-4 p-4" id="dashboard">
                    <div className="welcome m-3">
                        <h1 className="m-2">Good Evening, user!</h1>
                        <h3 className="m-2">Ready to focus? Your tasks await!</h3>
                    </div>
                    <>
                        <div className="d-flex card-list justify-content-between gap-5">
                            <Card>
                                <Card.Title>{total_t}</Card.Title>
                                <Card.Subtitle>Total Tasks</Card.Subtitle>
                            </Card>
                            <Card>
                                <Card.Title>{pending_t}</Card.Title>
                                <Card.Subtitle>Pending Tasks</Card.Subtitle>
                            </Card>
                            <Card>
                                <Card.Title>{pastdue_t}</Card.Title>
                                <Card.Subtitle>Past-Due Tasks</Card.Subtitle>
                            </Card>
                            <Card>
                                <Card.Title>{completed_t}</Card.Title>
                                <Card.Subtitle>Completed Tasks</Card.Subtitle>
                            </Card>
                        </div>
                    </>
                </div>
                
                <div id="pending" className="rows">
                <br></br>
                <h3 className="ms-5 my-2 title_s p-1">Pending</h3>
                    
                    <div className="task-row ms-5 mb-3 p-1">
                    
                        {taskList
                            .filter((card) => card.Status === "pending")//pending tasks
                            .map((card) => (
                            <TaskCard
                                key={card._id}
                                Task={card}
                                onView={() =>
                                navigate(`/DetailedView/${card._id}`)
                                }
                                onEdit={() => handleEdit(card)}
                                onDelete={() => handleDelete(card)}
                            />
                            ))}
                    </div>
                </div>

                <br></br>

                <div id="past-due" className="rows">
                <br></br>
                <h3 className="ms-5 my-2 title_s p-1">Past Due</h3>
                    
                    <div className="task-row ms-5 mb-3 p-1">
                    
                    {taskList
                        .filter((card) => card.Status === "pastdue")//only past due tasks
                        .map((card) => (
                        <TaskCard
                            key={card._id}
                            Task={card}
                            onView={() =>
                            navigate(`/DetailedView/${card._id}`)
                            }
                            onEdit={() => handleEdit(card)}
                            onDelete={() => handleDelete(card)}
                        />
                        ))}
                </div>
                </div>

                <br></br>

                <div id="completed" className="rows">
                <br></br>
                <h3 className="ms-5 my-2 title_s p-1">Completed</h3>
                    
                    <div className="task-row ms-5 mb-3 p-1">
                    
                    {taskList
                        .filter((card) => card.Status === "completed") //only completed tasks
                        .map((card) => (
                        <TaskCard
                            key={card._id}
                            Task={card}
                            onView={() =>
                            navigate(`/DetailedView/${card._id}`)
                            }
                            onEdit={() => handleEdit(card)}
                            onDelete={() => handleDelete(card)}
                        />
                        ))}
                </div>
                </div>
            
                {showModal && (
                    <TaskForm
                        show={showModal}
                        onHide={() => { setTaskToEdit(null); setshowModal(false); }}
                        onSave={handleSave}
                        existingTask={taskToEdit}
                    />
                )}


        </>
    );
}

export default TaskManager;