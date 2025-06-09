/*
Страница за логин
*/

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/start");
    } catch (err) {
      alert("Грешен имейл или парола");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-container">
      <h2>Вход</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Имейл"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Парола"
        required
      />
      <button type="submit">Влез</button>

      <p>
        Нямаш акаунт? <Link to="/register">Регистрирай се</Link>
      </p>
    </form>
  );
}
