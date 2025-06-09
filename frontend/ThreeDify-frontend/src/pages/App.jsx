/*
 Главен компонент на приложението. Импортира и показва CubeScene, който съдържа 3D куба; CubeNet, който съдържа разгъвките.
 */

import { useState } from 'react';
import { Link } from "react-router-dom";
import CubeScene from './components/CubeScene';
import CubeNet from './components/CubeNet';
import './App.css';

// Генерира 6 добре различими цвята чрез равномерно разпределение по цветния кръг (HSL). Така всеки цвят е различен
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

// Масив, който представя вярната разгъвка на куба. Това е 4x3 grid
const correctLayout = [
  null, null, 2, null,
  1, 4, 0, 5,
  null, null, 3, null
];

// Създава count на брой разгъвки (винаги 1 вярна + 3 фалшиви, които са с микснати цветове)
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

function App() {
  const [cubeColors] = useState(generateDistinctColors());
  const [layouts] = useState(generateRandomLayouts(correctLayout));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleClick = (index) => {
    setSelectedIndex(index);
    setIsCorrect(layouts[index].every((v, i) => v === correctLayout[i]));
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
          <h1>Избери правилната разгъвка на куба</h1>
          <p>Върти куба и избери верния вариант.</p>

          <div className="cube-section">
            <CubeScene colors={cubeColors} />
          </div>

          <div className="nets-row">
            {layouts.map((layout, index) => {
              let borderColor = '#ccc';
              if (selectedIndex === index) {
                borderColor = isCorrect ? '#4CAF50' : '#f44336';
              }

              return (
                <div
                  key={index}
                  className="net-option"
                  style={{ borderColor }}
                  onClick={() => handleClick(index)}
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

export default App;
