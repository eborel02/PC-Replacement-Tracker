import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const SemiCircleProgress = ({ value = 0, label = "", size = 350 }) => {
  const percent = Math.min(Math.max(value, 0), 100);

  const data = [
    { name: "Completed", value: percent },
    { name: "Remaining", value: 100 - percent },
  ];

  const COLORS = [
    percent > 80 ? "#4caf50" : percent > 50 ? "#ff9800" : "#f44336",
    "#e0e0e03a", // dull gray
  ];

  const chartHeight = size * 0.5; // Adjust height for semi-circle

  const labelOffset = chartHeight / 2 + 20; // Center label vertically with some buffer

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



// import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

// const SemiCircleProgress = ({ value = 0, label = "", size =350 }) => {
//     // Make sure value is between 0 and 100
//     const percent = Math.min(Math.max(value, 0), 100);

//     // Data array for RadialBarChart
//     const data = [
//         { name: "Completed", value: percent, fill: percent > 80 ? "#4caf50" : percent > 50 ? "#ff9800" : "#f44336" },
//         { name: "Remaining", value: 100 - percent, fill: "#e0e0e0" }
    
//     ];

//     const chartHeight = size * 0.5; // Adjust height for semi-circle

//     return (
//         <div style={{ 
//             width: size,
//             height: chartHeight - 50,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             flexDirection: "column",
//             margin: "0 auto"
//         }}>
//         <RadialBarChart
//             width={size}
//             height={chartHeight}
//             cx="50%"
//             cy={chartHeight}
//             innerRadius="70%"
//             outerRadius="100%"
//             barSize={20}
//             data={data}
//             startAngle={180}
//             endAngle={0}
            
//         >
//             <PolarAngleAxis
//                 type="number"
//                 domain={[0, 100]}
//                 tick={false} // no tick labels
//             />
//             <RadialBar
//                 dataKey="value"
//                 cornerRadius={10}
//                 fill={
//                 percent > 80 ? "#4caf50" : percent > 50 ? "#ff9800" : "#f44336"
//             }
//             />
//         </RadialBarChart>

//         {/* Center label */}
//             <div style={{
//                 position: "relative",
//                 top : "-30px",
//                 textAlign: "center",
//                 fontWeight: "bold",
//                 fontSize: "1.25rem",
//             }}>
//                 {`${percent}%`}
//             </div>
//             <div style={{
//                 position: "relative",
//                 top : "-25px",
//                 fontSize: "1rem",
//             }}>
//                 {label}
//             </div>
//         </div>
//     );
// };

// export default SemiCircleProgress;