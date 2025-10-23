import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Principal from './Components/Calendar/Principal';
import Config from './Components/Config/Config';

const App = () => {
  // tem que ser false para autentirar (lembrar)
  const [isAuthenticated, setIsAuthenticated] = useState(true);

   const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken"); 
  };

  return (
    <div>
      <Router>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<div className="entrada"><Register /></div>} />
              <Route path="/login" element={<div className="entrada"><Login onLogin={handleLogin} /></div>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/principal" element={<Principal />} />
              <Route
                path="/config"
                element={
                  <Config
                    onLogout={handleLogout}
                    isSoundEnabled={true}
                    setIsSoundEnabled={() => {}}
                    isDarkMode={false}
                    setIsDarkMode={() => {}}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/principal" />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
};

export default App;