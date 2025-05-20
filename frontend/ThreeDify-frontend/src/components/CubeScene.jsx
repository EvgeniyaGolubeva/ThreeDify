/*
  Компонент за визуализация на 3D куб с 6 различно оцветени страни. Използва @react-three/fiber за рендиране с Three.js вътре в React.
    Създавам куб (boxGeometry) с 6 страни. Всяка страна получава различен цвят чрез 6 отделни материала.
  - attach="material-X" указва коя страна получава кой материал.
  - Добавен е TrackballControls за въртене на куба с мишка.
*/

import { Canvas } from '@react-three/fiber';
import { TrackballControls } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useState } from 'react';

function AnimatedCube({ colors }) {
  const cubeRef = useRef();

  const faceMaterials = colors.map((color, i) => (
    <meshStandardMaterial key={i} attach={`material-${i}`} color={color} />
  ));

  const targetRotation = {
    x: Math.PI / 5,
    y: Math.PI / 3,    
  };

  const [animationDone, setAnimationDone] = useState(false);

  useFrame(() => {
    const mesh = cubeRef.current;
    if (!mesh || animationDone) return;

    const speed = 0.05; 
    const dx = targetRotation.x - mesh.rotation.x;
    const dy = targetRotation.y - mesh.rotation.y;

    mesh.rotation.x += dx * speed;
    mesh.rotation.y += dy * speed;

    if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) { //stop the animation
      mesh.rotation.x = targetRotation.x;
      mesh.rotation.y = targetRotation.y;
      setAnimationDone(true);
    }
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[3, 3, 3]} />
      {faceMaterials}
    </mesh>
  );
}


export default function CubeScene({ colors }) {
  const defaultColors = ['#EF5350', '#42A5F5', '#66BB6A', '#FFCA28', '#AB47BC', '#FFA726'];
  const faceColors = colors && colors.length === 6 ? colors : defaultColors;

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <Canvas style={{ height: '600px', width: '600px' }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, -5, 5]} intensity={0.6} />

        <AnimatedCube colors={faceColors} />

        <TrackballControls zoomSpeed={0} />
      </Canvas>
    </div>
  );
}
