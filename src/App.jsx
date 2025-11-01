import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Principal from './Components/Calendar/Principal';
import Config from './Components/Config/Config';

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("authToken", "userLoggedIn");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
  };

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/" element={<div className="entrada"><Login onLogin={handleLogin} /></div>} />
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
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;