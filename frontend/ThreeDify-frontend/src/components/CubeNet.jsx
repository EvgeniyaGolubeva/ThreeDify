/*
  Разгъвка на куб. Получава colors - масив от 6 цвята и layout - позицията на страните в 2D разгъвка
  - layout е фиксиран 4x3 grid, съдържащ числа от 0 до 5 (за страните) или null (празно място)
  - За всяко число в layout се рендерира квадрат с цвета от colors[index]
  - Използва CSS grid, за да изобрази формата на разгъвката
*/


import './CubeNet.css';

export default function CubeNet({ colors, layout }) {
  return (
    <div className="cube-net">
      {layout.map((faceIndex, i) => {
        if (faceIndex === null) {
          return <div key={i} className="net-cell empty" />;
        }

        const faceColor = colors[faceIndex];

        return (
          <div
            key={i}
            className="net-cell"
            style={{ backgroundColor: faceColor }}
          />
        );
      })}
    </div>
  );
}
