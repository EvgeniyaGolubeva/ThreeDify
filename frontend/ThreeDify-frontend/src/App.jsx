/*
 Главен компонент на приложението. Импортира и показва CubeScene, който съдържа 3D куба.
 */

import CubeScene from './components/CubeScene';
import './App.css';

const cubeColors = ['#EF5350', '#42A5F5', '#66BB6A', '#FFCA28', '#AB47BC', '#FFA726'];

function App() {
  return (
    <div className="app-container">
      <CubeScene colors={cubeColors} />
    </div>
  );
}

export default App;
