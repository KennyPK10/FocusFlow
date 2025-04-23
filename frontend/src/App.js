import React from 'react';
import './App.css';
import TaskManager from './TaskManager';
import DetailedView from './DetailedView';
import FocusPage from './Focus';
import Login from './Login';
import Signup from './Signup';
import WeeklyView from './WeeklyView';
import { Route, Routes } from 'react-router-dom';

function App() {
  
  return (
    <>
      <Routes>
        <Route path='/' index element={<Login/>} ></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/TaskManager' element={<TaskManager/>}></Route>
        <Route path='/DetailedView/:tid' element={<DetailedView/>}></Route>
        <Route path='/Focus/:tid' element={<FocusPage/>}></Route>
        <Route path='/WeeklyView' element={<WeeklyView/>}></Route>
      </Routes>
      
    </>
  );
}

export default App;

