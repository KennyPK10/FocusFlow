import { Card, Button, Badge } from 'react-bootstrap';
import '../css/TaskCard.css';

function TaskCard({ Task, onView, onEdit, onDelete }) {
  const { TaskName = '', Priority = '', Due = '', CheckPoints = [] } = Task;
  const TotalCheckPoints = CheckPoints.length;
  const CheckPointsCompleted = CheckPoints.filter(c => c.done === true).length;

  return (
    <div className="task-card">
      <div className="card-inner">
        {/* FRONT SIDE */}
        <div className="card-front">
          <Card className="h-100 border-0">
            <Card.Body>
              <h1 className='bi bi-bullseye' style={{color:'white'}}></h1>
              <Card.Title className="task-title" style={{color:'white', fontWeight:'bolder',fontSize: '1.5rem'}}>{TaskName}</Card.Title>
              <Card.Subtitle className="task-subtitle">
                <Badge bg={Priority === "high" ? "danger" : Priority === "medium" ? "warning" : "success"}>
                  {Priority} Priority
                </Badge>
              </Card.Subtitle>
              <Card.Text className="task-text">
                Due: {new Date(Due).toLocaleDateString()} <br />
                Checkpoints Completed: {CheckPointsCompleted} / {TotalCheckPoints}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        {/* BACK SIDE */}
        <div className="card-back">
          <Card className="h-100 border-0 bg-light">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <Card.Title className="task-title" style={{color:'white', fontWeight:'bolder',fontSize: '1.5rem'}}>{TaskName}</Card.Title>
              <div className="task-buttons">
                <Button variant="modern-btn edit-btn" onClick={onEdit}>Edit</Button>
                <Button variant="modern-btn delete-btn" onClick={onDelete}>Delete</Button>
                <Button variant="modern-btn view-btn" onClick={onView}>View</Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
