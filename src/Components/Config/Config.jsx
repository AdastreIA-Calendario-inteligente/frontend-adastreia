import React from "react";
import { useNavigate } from "react-router-dom";
import "./Config.css";

// Componente Config: Modal de configurações do usuário
const Config = ({ onClose, isSoundEnabled, setIsSoundEnabled, isDarkMode, setIsDarkMode, onLogout }) => {
  const navigate = useNavigate();

  // Função para realizar logout do usuário
  const handleLogout = () => {
    onLogout(); // Chama a função de logout passada como prop
    navigate("/login"); // Redireciona o usuário para a página de login

    // Recarrega a página após 1 segundo para garantir que o estado seja atualizado
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    // Modal principal de configurações
    <div className="config-modal">
      <div className="config-content">
        {/* Botão para fechar o modal */}
        <button className="config-close-button" onClick={onClose}>
          X
        </button>

        {/* Título do modal */}
        <h2>Menu</h2>

        {/* Opção para habilitar/desabilitar som */}
        <div className="config-option">
          <label className="toggle-label">
            Som
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={isSoundEnabled} // Estado atual do som
                onChange={() => setIsSoundEnabled(!isSoundEnabled)} // Alterna o estado do som
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>

        {/* Opção para habilitar/desabilitar modo noturno */}
        <div className="config-option">
          <label className="toggle-label">
            Modo Noturno
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={isDarkMode} // Estado atual do modo noturno
                onChange={() => setIsDarkMode(!isDarkMode)} // Alterna o estado do modo noturno
              />
              <span className="slider"></span>
            </div>
          </label>
        </div>

        {/* Botão para realizar logout */}
        <button className="logout-button" onClick={handleLogout}>
          Fazer Logout
        </button>
      </div>
    </div>
  );
};

export default Config;