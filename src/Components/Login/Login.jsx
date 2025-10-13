import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

<p>
  Não tem uma conta? <Link to="/register">Registrar</Link>
</p>

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        // passe aqui o envio para o nosso backend
        event.preventDefault();

    }

    return(
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Adastel IA</h1>
                <div className="input-field">
                <input type="email" placeholder="E-mail" onChange={(e) => setUsername(e.target.value)}/>
                <FaUser className="icon"/>
                </div>
                <div className="input-field" >
                <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)}/>
                <FaLock className="icon"/>
                </div>
                <div className="recall-forget">
                    <a href="#">Esqueceu a senha?</a>
                </div>
                <button>Entrar</button>

                <div className="signup-link">
                    <p>
                        Não tem uma conta? <Link to="/register">Registrar</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Login;