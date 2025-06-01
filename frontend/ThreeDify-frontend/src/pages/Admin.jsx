import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

export default function AdminPanel() {
  const { token } = useAuth();
  const [stats, setStats] = useState([]);

    const makeAdmin = async (user) => {
    try {
        const res = await axios.post(`/admin/make_admin/${user.id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
        });
        const updated = await axios.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
        });
        setStats(updated.data);
    } catch (err) {
        alert("Грешка при правене на админ");
    }
    };

  useEffect(() => {
    axios
      .get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Admin fetch error:", err));
  }, [token]);

  return (
    <div style={{ padding: "2em" }}>
      <h1>Админ панел</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Опити</th>
            <th style={thStyle}>Точност (%)</th>
            <th style={thStyle}>Тренд</th>
            <th style={thStyle}>Админ</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((user, index) => (
            <tr key={index}>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>{user.tries}</td>
              <td style={tdStyle}>{(Number(user.accuracy)).toFixed(2)}</td>
              <td style={tdStyle}>{user.trend > 0 ? "📈" : user.trend < 0 ? "📉" : "➖"}</td>
              <td style={tdStyle}>{user.is_admin ? "Вече е" : (
                <button onClick={() => makeAdmin(user)} style={{ fontSize: "0.9em" }}>
                    Направи админ
                </button>
                )}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "0.5em",
  background: "#f0f0f0",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "0.5em",
  textAlign: "center",
};
