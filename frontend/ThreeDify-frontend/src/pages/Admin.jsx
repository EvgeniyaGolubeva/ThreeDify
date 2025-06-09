import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import './Admin.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth(); // само едно извикване

  const [stats, setStats] = useState([]);

  if (!user?.is_admin) {
    return (
      <div className="game-window">
        <h2>Нямаш достъп до админ панела.</h2>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const makeAdmin = async (user) => {
    try {
      await axios.post(`/admin/make_admin/${user.id}`);
      const updated = await axios.get("/admin/stats");
      setStats(updated.data);
    } catch (err) {
      alert("Грешка при правене на админ");
    }
  };

  useEffect(() => {
    axios
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Admin fetch error:", err));
  }, [token]);

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

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>ThreeDify</h2>
        <nav>
          <ul>
            <li><Link to="/start">Начало</Link></li>
            <li><Link to="/exercise">Упражнения</Link></li>
            <li><Link to="/account">Статистика</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="game-window">
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
                  <td style={tdStyle}>{Number(user.accuracy).toFixed(2)}</td>
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
      </main>
    </div>
  );
}
