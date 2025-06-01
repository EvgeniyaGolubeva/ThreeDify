/*
Страница за резултати
*/

import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = location.state;

  if (!session) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Няма данни за резултат.</h2>
        <button onClick={() => navigate("/start")}>Обратно</button>
      </div>
    );
  }

  const {
    correct_answers,
    incorrect_answers,
    duration_seconds,
    accuracy,
    trend,
    created_at,
  } = session;
  
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Резултат от упражнението</h1>    

      <p><strong>Време:</strong> {Math.floor(duration_seconds / 60)}:{(duration_seconds % 60).toString().padStart(2, "0")}</p>
      <p><strong>Верни:</strong> {correct_answers}</p>
      <p><strong>Грешни:</strong> {incorrect_answers}</p>
      <p><strong>Оценка:</strong> {(accuracy).toFixed(2)}%</p>
      <p><strong>Тренд:</strong> {trend > 0 ? "📈 Подобрение" : trend < 0 ? "📉 Влошаване" : "➖ Без промяна"}</p>
      <p><strong>Дата:</strong> {new Date(created_at).toLocaleString()}</p>

      <div style={{ marginTop: "2em" }}>
        <button onClick={() => navigate("/start")} style={{ padding: "1em", marginRight: "10px" }}>
          Ново упражнение
        </button>
        <button onClick={() => navigate("/account")} style={{ padding: "1em" }}>
          Към акаунта
        </button>
      </div>
    </div>
  );
}
