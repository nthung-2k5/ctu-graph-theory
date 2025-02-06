// import React, { useState } from "react";

const PseudoCode: React.FC = () => {
  // const [isHidden, setIsHidden] = useState(false);

  const bfsPseudocode = `
    function BFS(đồ_thị, đỉnh_bắt_đầu):
  `;

  // const toggleVisibility = () => setIsHidden(!isHidden);

  return (
    <>
      <div
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#fff",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          width: "100%",
          height: "100%",
          transition: "transform 0.5s ease", 
          // transform: isHidden ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "600",
            color: "#1F5CA9",
          }}
        >
          Mã giả thuật toán BFS
        </h3>
        <p>{bfsPseudocode}</p>
      </div>
      {/* <button
        onClick={toggleVisibility}
        style={{
          position: "fixed",
          left: "16px",
          bottom: "16px",
          padding: "8px 16px",
          backgroundColor: "#1F5CA9",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {isHidden ? "Hiện mã giả" : "Ẩn mã giả"}
      </button> */}
    </>
  );
};

export default PseudoCode;
