import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Principal from './Components/Calendar/Principal';
import Config from './Components/Config/Config';

// Componente principal da aplicação
const AppContent = () => {
  // Estado para verificar se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica se há um token de autenticação no localStorage ao carregar o componente
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true); // Define o estado como autenticado se o token existir
    }
  }, []);

  // Função para lidar com o login do usuário
  const handleLogin = () => {
    setIsAuthenticated(true); // Define o estado como autenticado
    localStorage.setItem("authToken", "userLoggedIn"); // Armazena um token no localStorage
  };

  // Função para lidar com o logout do usuário
  const handleLogout = () => {
    setIsAuthenticated(false); // Define o estado como não autenticado
    localStorage.removeItem("authToken"); // Remove o token do localStorage
  };

  return (
    <Routes>
      {/* Rotas para usuários não autenticados */}
      {!isAuthenticated ? (
        <>
          {/* Rota para a página de login */}
          <Route path="/" element={<div className="entrada"><Login onLogin={handleLogin} /></div>} />
          <Route path="/register" element={<div className="entrada"><Register /></div>} />
          <Route path="/login" element={<div className="entrada"><Login onLogin={handleLogin} /></div>} />
          {/* Redireciona qualquer rota não encontrada para a página de login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <>
          {/* Rotas para usuários autenticados */}
          <Route path="/principal" element={<Principal />} />
          <Route
            path="/config"
            element={
              <Config
                onLogout={handleLogout} // Passa a função de logout como prop
                isSoundEnabled={true} // Configuração de som (placeholder)
                setIsSoundEnabled={() => {}} // Função para alterar o som (placeholder)
                isDarkMode={false} // Configuração de modo escuro (placeholder)
                setIsDarkMode={() => {}} // Função para alterar o modo escuro (placeholder)
              />
            }
          />
          {/* Redireciona qualquer rota não encontrada para a página principal */}
          <Route path="*" element={<Navigate to="/principal" />} />
        </>
      )}
    </Routes>
  );
};

// Componente principal que encapsula o roteador
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;