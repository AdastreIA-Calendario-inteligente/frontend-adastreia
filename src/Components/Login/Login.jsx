import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token); 
        onLogin();
        navigate("/principal");
      } else {
        const errorData = await response.json();
        alert(`Erro ao fazer login: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin}>
        <h1>Adastel IA</h1>
        <div className="input-field">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        <div className="recall-forget">
          <a href="#">Esqueceu a senha?</a>
        </div>
        <button type="submit">Entrar</button>
        <div className="signup-link">
          <p>
            Não tem uma conta? <a href="/register">Registrar</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;