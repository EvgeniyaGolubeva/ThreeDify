/*
Страница за упражненията
*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CubeScene from "../components/CubeScene";
import CubeNet from "../components/CubeNet";
import axios from "../api/axios";
import './Exercise.css';

function generateDistinctColors(count = 6) {
  const step = 360 / count;
  const baseHue = Math.floor(Math.random() * 360);
  const colors = [];

  for (let i = 0; i < count; i++) {
    const hue = (baseHue + i * step) % 360;
    const saturation = 85;
    const lightness = 50;
    colors.push(`hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`);
  }

  return colors.sort(() => Math.random() - 0.5);
}

const correctLayout = [
  null, null, 2, null,
  1, 4, 0, 5,
  null, null, 3, null
];

function generateRandomLayouts(correctLayout, count = 4) {
  const layouts = [correctLayout];

  while (layouts.length < count) {
    const used = new Set();
    const shuffled = [];

    for (let i = 0; i < correctLayout.length; i++) {
      const val = correctLayout[i];
      if (val === null) {
        shuffled.push(null);
      } else {
        let random;
        do {
          random = Math.floor(Math.random() * 6);
        } while (used.has(random));
        used.add(random);
        shuffled.push(random);
      }
    }

    const same = shuffled.every((v, i) => v === correctLayout[i]);
    if (!same) layouts.push(shuffled);
  }

  return layouts.sort(() => Math.random() - 0.5);
}

export default function Exercise() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(180); // 3 мин
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [cubeColors, setCubeColors] = useState(generateDistinctColors());
  const [layouts, setLayouts] = useState(generateRandomLayouts(correctLayout));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  // Таймер
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleAnswer = (index) => {
    if (selectedIndex !== null) return; // предотврати повторен клик
    setSelectedIndex(index);
    const correct = layouts[index].every((v, i) => v === correctLayout[i]);

    if (correct) {
      setCorrectAnswers((c) => c + 1);
      setIsCorrect(true);
    } else {
      setIncorrectAnswers((c) => c + 1);
      setIsCorrect(false);
    }

    // Зареждане на нова задача след 1.2 сек
    setTimeout(() => {
      setCubeColors(generateDistinctColors());
      setLayouts(generateRandomLayouts(correctLayout));
      setSelectedIndex(null);
      setIsCorrect(null);
    }, 1200);
  };

  const handleFinish = async () => {
    const duration = 180 - timeLeft;

    try {
      яconsole.log("Token:", localStorage.getItem("token"));
      const res = await axios.post("/sessions/save", {
        correct_answers: correctAnswers,
        incorrect_answers: incorrectAnswers,
        duration_seconds: duration
      });

      navigate("/result", { state: res.data });
    } catch (err) {
      alert("Грешка при записване на сесията.");
    }
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
        <h2>Оставащо време: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</h2>
        <p>Върти куба и избери вярната разгъвка!</p>

        <div className="cube-section">
          <CubeScene colors={cubeColors} />
        </div>

        <div className="nets-row">
          {layouts.map((layout, index) => {
            let borderColor = "#ccc";
            if (selectedIndex === index) {
              borderColor = isCorrect ? "#4CAF50" : "#f44336";
            }

            return (
              <div
                key={index}
                className="net-option"
                style={{ borderColor }}
                onClick={() => handleAnswer(index)}
              >
                <CubeNet colors={cubeColors} layout={layout} />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  </div>
);
}