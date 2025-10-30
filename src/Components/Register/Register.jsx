import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/api/usuarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: name, email, senha: password }), 
      });
  
      if (response.ok) {
        alert("Usuário registrado com sucesso!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(`Erro ao registrar: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="container">
      <h1>Registrar</h1>
      <form onSubmit={handleRegister}>
        <div className="input-field">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-field">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
      <div className="signup-link">
        <p>
          Já tem uma conta? <a href="/login">Faça login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;