/*
начална страница
*/

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Start.css';
import './App.css';

export default function Start() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleStart = () => {
    navigate("/exercise"); 
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAccount = () => {
    navigate("/account");
  };

  const handleAdmin = () => {
    navigate("/admin");
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
          <h1>Здравей, {user?.email} 👋</h1>
          <p>Готов ли си за следващото предизвикателство?</p>

          <div className="start-buttons">
            <button onClick={handleStart}>Започни упражнение</button>
            <button onClick={handleAccount}>Моите резултати</button>
            {user?.is_admin && <button onClick={handleAdmin}>Админ панел</button>}
            <button onClick={handleLogout}>Изход</button>
          </div>
        </div>
      </main>
    </div>
  );
}
