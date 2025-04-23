import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Auth.css';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() && password.trim()) {
      try{  
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {email,password},{withCredentials:true});
        console.log(res.data);
        if(res.data.u_id !== null && res.data.u_id !== undefined){
        console.log(res.data.u_id);
        navigate('/TaskManager', {state:{user_id: res.data.u_id}}); // Go to TaskManager page
      }
      else{
        alert(res.data.comment);
      }
    }catch(err){
      console.log(err);
      alert("Enter valid credentials");
    }
    }
  };

  return (

    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content-panel">
          <h1>Welcome to FocusFlow</h1>
          <p>
            Your personal academic companion! Track your study progress, manage tasks efficiently,
            and stay organized with our intuitive planning tools.
          </p>
        </div>
        <div className="auth-form-panel">
          <div className="auth-card">
            <h2 className="auth-title">USER LOGIN</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Username"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="auth-button w-100">
                LOGIN
              </Button>

              <div className="auth-footer text-center mt-4">
                Don't have an account?{' '}
                <span
                  style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                  onClick={()=>{navigate('/signup')}}
                >
                  Sign up
                </span>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
