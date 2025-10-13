import React from "react";
import "../Login/Login.css";

const Register = () => {
  return (
    <div className="container">
      <h1>Registrar</h1>
      <form>
        <div className="input-field">
          <input type="text" placeholder="Nome" />
        </div>
        <div className="input-field">
          <input type="email" placeholder="E-mail" />
        </div>
        <div className="input-field">
          <input type="password" placeholder="Senha" />
        </div>
        <button>Registrar</button>
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