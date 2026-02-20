import React from "react";
import { PieChart, Pie, Cell } from "recharts";

// SemiCircleProgress component to display a semi-circular progress chart
const SemiCircleProgress = ({ value = 0, label = "", size = 350 }) => {
  // Ensure value is between 0 and 100
  const percent = Math.min(Math.max(value, 0), 100);

  // Data array for PieChart
  const data = [
    { name: "Completed", value: percent },
    { name: "Remaining", value: 100 - percent },
  ];

  // Determine colors based on percentage
  const COLORS = [
    percent > 80 ? "#4caf50" : percent > 50 ? "#ff9800" : "#f44336",
    "#e0e0e03a", // dull gray
  ];

  // Calculate chart height for semi-circle
  const chartHeight = size * 0.5;

  // Calculate label offset to position percentage and label correctly
  const labelOffset = chartHeight / 2 + 20;

  return (
    <div
      style={{
        width: size,
        height: chartHeight + 50, // Add buffer for labels
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: "0 auto",
        marginBottom: "-100px", // Pull up to overlap with next section
      }}
    >
      <PieChart width={size} height={chartHeight}>
        <Pie
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius="70%"
          outerRadius="100%"
          paddingAngle={0}
          dataKey="value"
          
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      <div
        style={{
          position: "relative",
          top: `${-labelOffset}px`,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.25rem",
        }}
      >
        {percent}%
      </div>
      <div
        style={{
          position: "relative",
          top: `${-labelOffset}px`, // Position label below percentage
          fontSize: "1rem",
          color: "#555",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default SemiCircleProgress;