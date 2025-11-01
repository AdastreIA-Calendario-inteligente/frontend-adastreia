import React from "react";
import { useNavigate } from "react-router-dom";
import "./Config.css";

const Config = ({ onClose, isSoundEnabled, setIsSoundEnabled, isDarkMode, setIsDarkMode, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="config-modal">
      <div className="config-content">
        <button className="config-close-button" onClick={onClose}>
          X
        </button>
        <h2>Menu</h2>
        <div className="config-option">
          <label className="toggle-label">
            Som
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={isSoundEnabled}
                onChange={() => setIsSoundEnabled(!isSoundEnabled)}
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>
        <div className="config-option">
          <label className="toggle-label">
            Modo Noturno
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Fazer Logout
        </button>
      </div>
    </div>
  );
};

export default Config;