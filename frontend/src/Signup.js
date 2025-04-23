import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './css/Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate=useNavigate()


  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle signup logic here
    if(password !== confirmPassword){
        alert("Passwords do not match");
    }
    else{
      try{
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/register`,{email,password,confirmPassword});
        alert(res.data.comment);
        // After signup, navigate back to login
      if(res.data.ok === 1){
        navigate('/');
      }
    }catch(error){
      console.log("error registering user");
    }  
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content-panel">
          <h1>Join FocusFlow</h1>
          <p>
            Get ready to transform your study routine! Create custom study schedules, track your progress in real-time, and break down complex topics into manageable tasks. Join thousands of students who've already improved their academic performance with Study Planner.
          </p>
        </div>
        <div className="auth-form-panel">
          <div className="auth-card">
            <h2 className="auth-title">CREATE ACCOUNT</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="Email address"
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

              <Form.Group className="mb-4">
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm password"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="auth-button w-100">
                SIGN UP
              </Button>

              <div className="auth-footer text-center mt-4">
                Already have an account?{' '}
                <span
                  style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={()=>{navigate('/')}}
                >
                  Login
                </span>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
