/*
Страница за акаунти
*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Account() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/results")
      .then((res) => setSessions(res.data))
      .catch(() => alert("Неуспешно зареждане на резултати."));
  }, []);

  const formatDate = (iso) => new Date(iso).toLocaleString("bg-BG");

  const chartData = sessions.map((s, i) => ({
    name: `#${i + 1}`,
    accuracy: parseFloat(s.accuracy).toFixed(2),
  }));

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Акаунт</h1>

      <h3>Точност във времето:</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="accuracy" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <h3 style={{ marginTop: "2rem" }}>История на сесиите:</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {sessions.map((s, i) => (
          <div key={i} style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            width: "calc(50% - 1rem)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <p><strong>Дата:</strong> {formatDate(s.created_at)}</p>
            <p><strong>Верни:</strong> {s.correct_answers}</p>
            <p><strong>Грешни:</strong> {s.incorrect_answers}</p>
            <p><strong>Точност:</strong> {parseFloat(s.accuracy).toFixed(2)}%</p>
            <p><strong>Време:</strong> {Math.floor(s.duration_seconds / 60)}:{(s.duration_seconds % 60).toString().padStart(2, "0")}</p>
            <p><strong>Тренд:</strong> {s.trend > 0 ? "📈 Подобрение" : s.trend < 0 ? "📉 Влошаване" : "➖"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
