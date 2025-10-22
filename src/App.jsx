import React from "react";
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Principal from './Components/Calendar/Principal'; 



const App = () => {
  return (
    <div >
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<div className="entrada"><Register /></div>} />
          <Route path="/login" element={<div className="entrada"><Login /></div>} />
          <Route path="/principal" element={<Principal />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App
