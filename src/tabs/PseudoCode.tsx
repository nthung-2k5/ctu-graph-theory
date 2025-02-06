// import React, { useState } from "react";
import { stackDfsPseudoCode } from '../lib/algorithms/traversal/RecursionDFS';

const PseudoCode: React.FC = () => {
  // const [isHidden, setIsHidden] = useState(false);

  const bfsPseudocode = `
    function BFS(đồ_thị, đỉnh_bắt_đầu):
  `;

  // const toggleVisibility = () => setIsHidden(!isHidden);

  return (
    <>
      <div className="pseudoComponent">
        <div className="comment">
          Vertex 0 is explored, we have a bidirectional edge (a trivial cycle).
        </div>

        <hr style={{margin: "8px 0px"}} />

        <div className="pseudoCodeContainer">
          {stackDfsPseudoCode.map((data, index) => {
            return (
              <p 
                className="pseudoCodeText"
                style={{ marginLeft: `${data.tab * 18}px` }}
                key={index}
              >
                {data.text}
              </p>
            );
          })}
          <p>.</p>
          <p>.</p>
          <p>.</p>
          <p>.</p>
        </div>
      </div>
    </>
  );
};

export default PseudoCode;
