import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";

<p>
  Não tem uma conta? <Link to="/register">Registrar</Link>
</p>

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
          
            // const response = await fetch("https://nossa-api/login", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({ username, password }),
            // });
            const mockResponse = { ok: true };


            if (mockResponse.ok) {
                navigate("/principal");
            } else {
                alert("Usuário ou senha inválidos!");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Ocorreu um erro. Tente novamente mais tarde.");
        }
    };

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