/*
Страница за регистрация
*/

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate("/start");
    } catch (err) {
      alert("Грешка при регистрация");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Регистрация</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Имейл" />
      <br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Парола" />
      <br />
      <button type="submit">Регистрирай се</button>

      <p style={{ marginTop: "1em" }}>
        Вече имаш акаунт? <Link to="/login">Влез тук</Link>
      </p>
    </form>
  );
}
