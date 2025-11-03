import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../Login/Login.css";

// Componente de Login
const Login = ({ onLogin }) => {
  // Estados para armazenar o e-mail e a senha do usuário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hook para navegação entre páginas
  const navigate = useNavigate();

  // Função para lidar com o envio do formulário de login
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    try {
      // Cria os dados do formulário no formato URL-encoded
      const formData = new URLSearchParams();
      formData.append("grant_type", ""); // Campo vazio, pode ser configurado conforme necessário
      formData.append("username", email); // Adiciona o e-mail do usuário
      formData.append("password", password); // Adiciona a senha do usuário
      formData.append("scope", ""); // Campo vazio, pode ser configurado conforme necessário
      formData.append("client_id", ""); // Campo vazio, pode ser configurado conforme necessário
      formData.append("client_secret", ""); // Campo vazio, pode ser configurado conforme necessário

      // Faz a requisição para a API de login
      const response = await fetch("/api/usuarios/login", {
        method: "POST", // Método POST para envio de dados
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Define o tipo de conteúdo
          Accept: "application/json", // Aceita resposta em JSON
        },
        body: formData.toString(), // Converte os dados do formulário para string
      });

      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
        const data = await response.json(); // Converte a resposta para JSON
        console.log("Resposta da API:", data);

        // Armazena o token de acesso no localStorage
        localStorage.setItem("access_token", data.access_token);

        // Chama a função de login passada como prop
        onLogin();

        // Redireciona o usuário para a página principal
        navigate("/principal");
      } else {
        // Caso a resposta não seja bem-sucedida, exibe uma mensagem de erro
        const errorData = await response.json();
        alert(`Erro ao fazer login: ${errorData.message}`);
      }
    } catch (error) {
      // Trata erros de conexão ou outros problemas
      console.error("Erro ao fazer login:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  };

  return (
    // Estrutura da tela de login
    <div className="container">
      <form onSubmit={handleLogin}>
        {/* Título da aplicação */}
        <h1>Adastrel IA</h1>

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

        {/* Link para recuperação de senha */}
        <div className="recall-forget">
          <a href="#">Esqueceu a senha?</a>
        </div>

        {/* Botão para enviar o formulário de login */}
        <button type="submit">Entrar</button>

        {/* Link para a página de registro */}
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