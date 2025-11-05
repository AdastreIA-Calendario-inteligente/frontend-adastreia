import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../Login/Login.css";

const Register = () => {
  // Estados para armazenar os valores do formulário
  const [name, setName] = useState(""); // Nome do usuário
  const [email, setEmail] = useState(""); // E-mail do usuário
  const [password, setPassword] = useState(""); // Senha do usuário
  const navigate = useNavigate(); // Hook para navegação entre páginas

  // Função para lidar com o envio do formulário de registro
  const handleRegister = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    try {
      // Envia os dados do formulário para o backend
      const response = await fetch("/api/usuarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Define o tipo de conteúdo como JSON
          Accept: "application/json",
        },
        body: JSON.stringify({ nome: name, email: email, senha: password }), // Converte os dados para JSON
      });

      if (response.ok) {
        // Se o registro for bem-sucedido, exibe uma mensagem e redireciona para a página de login
        alert("Usuário registrado com sucesso!");
        navigate("/login");
      } else {
        // Caso ocorra um erro, exibe a mensagem de erro retornada pelo backend
        const errorData = await response.json();
        alert(`Erro ao registrar: ${errorData.message}`);
      }
    } catch (error) {
      // Trata erros de conexão ou outros problemas
      console.error("Erro ao registrar:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="container">
      <h1>Registrar</h1>
      {/* Formulário de registro */}
      <form onSubmit={handleRegister}>
        {/* Campo de entrada para o nome */}
        <div className="input-field">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)} // Atualiza o estado do nome
          />
        </div>
        {/* Campo de entrada para o e-mail */}
        <div className="input-field">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado do e-mail
          />
          <FaUser className="icon" /> {/* Ícone de usuário */}
        </div>
        {/* Campo de entrada para a senha */}
        <div className="input-field">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado da senha
          />
          <FaLock className="icon" /> {/* Ícone de cadeado */}
        </div>
        {/* Botão para enviar o formulário */}
        <button type="submit">Registrar</button>
      </form>
      {/* Link para redirecionar para a página de login */}
      <div className="signup-link">
        <p>
          Já tem uma conta? <a href="/login">Faça login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;