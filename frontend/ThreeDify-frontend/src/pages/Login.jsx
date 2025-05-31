/*
Страница за логин
*/

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <form onSubmit={handleSubmit} style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Вход</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Имейл" />
      <br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Парола" />
      <br />
      <button type="submit">Влез</button>

      <p style={{ marginTop: "1em" }}>
        Нямаш акаунт? <Link to="/register">Регистрирай се</Link>
      </p>
    </form>
  );
}
