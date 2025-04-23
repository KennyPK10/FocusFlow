import React, { useState } from "react";
import '../css/TaskForm.css';
import { Modal, Form, ModalFooter, Button, Row, Col } from "react-bootstrap";

function TaskForm({ show, onHide, onSave, existingTask = null }) {
    const [Task, setTask] = useState(() => {
        return existingTask
          ? { ...existingTask }  // pre-filled values
          : {
              TaskName: '',
              Aim: '',
              Priority: 'high',
              Due: '',
              EstTime: '',
              CheckPoints: [],
              Comments: "",
              Status: "pending",
              UserID: ""
            };
      });
      

    const updateField = (field, value) => {
        const updatedValue = field === 'Due' ? new Date(value) : value;
        setTask({...Task, [field]: value});
    };
    
    const addCP = () => {
        if (Newcp.trim() !== "") {
            const newCheckpoint = { label: Newcp, done: false };
            setTask({ ...Task, CheckPoints: [...Task.CheckPoints, newCheckpoint] });
            setNewcp("");
        }
    };

    const removeCP = (index) => {
        const updatedCheckpoints = [...Task.CheckPoints];
        updatedCheckpoints.splice(index, 1);
        setTask({ ...Task, CheckPoints: updatedCheckpoints });
    };
      
    const [Newcp, setNewcp] = useState("");

    return (
        <Modal backdrop='static' show={show} size="lg" centered className="task-form-modal">
            <Modal.Header closeButton onHide={onHide}>
                <h4><i className="bi bi-clipboard-plus me-2"></i>Create New Task</h4>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={8}>
                            <Form.Group className="taskname mb-3">
                                <Form.Label><i className="bi bi-type me-2"></i>Task Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter task name"
                                    value={Task.TaskName} 
                                    onChange={(e) => updateField('TaskName', e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="priority mb-3">
                                <Form.Label><i className="bi bi-flag me-2"></i>Priority</Form.Label>
                                <Form.Select 
                                    className="priority-dropdown"
                                    value={Task.Priority}
                                    onChange={(e) => updateField('Priority', e.target.value)}
                                >
                                    <option value='high'>High</option>
                                    <option value='medium'>Medium</option>
                                    <option value='low'>Low</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="aim mb-3">
                        <Form.Label><i className="bi bi-bullseye me-2"></i>Task Goal</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={2}
                            placeholder="What do you want to achieve with this task?"
                            value={Task.Aim} 
                            onChange={(e) => updateField('Aim', e.target.value)}
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="date mb-3">
                                <Form.Label><i className="bi bi-calendar-event me-2"></i>Due Date</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={Task.Due} 
                                    onChange={(e) => updateField('Due', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="est-time mb-3">
                                <Form.Label><i className="bi bi-clock me-2"></i>Estimated Time</Form.Label>
                                <Form.Control 
                                    type="text"
                                    placeholder="e.g. 3 hours"
                                    value={Task.EstTime} 
                                    onChange={(e) => updateField('EstTime', e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="checkpoints mb-4">
                        <Form.Label><i className="bi bi-list-check me-2"></i>Checkpoints</Form.Label>
                        <div className="d-flex">
                            <Form.Control 
                                type="text"
                                placeholder="Add a checkpoint for your task"
                                value={Newcp} 
                                onChange={(e) => setNewcp(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addCP()}
                            />
                            <Button className="btn-add ms-2" onClick={addCP}>
                                <i className="bi bi-plus-lg"></i>
                            </Button>
                        </div>
                        
                        {Task.CheckPoints.length > 0 && (
                            <div className="checkpoint-list mt-3">
                                {Task.CheckPoints.map((cp, index) => (
                                    <div key={index} className="checkpoint-item">
                                        <span>{cp.label}</span>
                                        <Button 
                                            variant="light" 
                                            size="sm" 
                                            onClick={() => removeCP(index)}
                                        >
                                            <i className="bi bi-x text-danger"></i>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label><i className="bi bi-chat-left-text me-2"></i>Additional Comments</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3}
                            placeholder="Any additional notes or comments"
                            value={Task.Comments} 
                            onChange={(e) => updateField('Comments', e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <ModalFooter>
                <Button variant="outline-secondary" onClick={onHide} className="cancel">
                    <i className="bi bi-x-circle me-2"></i>Cancel
                </Button>
                <Button variant="success" onClick={() => onSave(Task)} className="create-final">
                    <i className="bi bi-check-circle me-2"></i>Create Task
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default TaskForm;