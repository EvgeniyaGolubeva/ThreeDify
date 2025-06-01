/*
начална страница
*/

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Здравей, {user?.email} 👋</h1>
      <p>Готов ли си за следващото предизвикателство?</p>
      <button onClick={handleStart} style={{ padding: "1em 2em", fontSize: "1.2em", marginRight: "10px" }}>
        Започни упражнение
      </button>

        <button
          onClick={handleAccount}
          style={{ padding: "1em 2em", fontSize: "1.2em", marginRight: "10px", background: "#2196f3", color: "#fff" }}
        >
          Моите резултати
        </button>

        {user?.is_admin && (
          <button
            onClick={handleAdmin}
            style={{ padding: "1em 2em", fontSize: "1.2em", marginRight: "10px", background: "#9c27b0", color: "#fff" }}
          >
            Админ панел
          </button>
        )}

      <button onClick={handleLogout} style={{ padding: "1em 2em", fontSize: "1.2em", background: "#f44336", color: "white" }}>
        Изход
      </button>
    </div>
  );
}
