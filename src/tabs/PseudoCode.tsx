// import React, { useState } from "react";
import { recursionDFS } from '../lib/algorithms/traversal/RecursionDFS';

const PseudoCode = () => 
{
    // const [isHidden, setIsHidden] = useState(false);
    // const [cmt, setCmt] = useState(pseudoInfo);

    // const toggleVisibility = () => setIsHidden(!isHidden);

    return (
        <>
            <div className="pseudoComponent">
                <div className="comment">// Mã giả chương trình...</div>

                <hr style={{margin: "8px 0px"}} />

                <div className="pseudoCodeContainer">
                    {recursionDFS.map((data, index) => 
                    {
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
                    {/* <p className='pseudoCodeText'>.</p>
          <p className='pseudoCodeText'>.</p>
          <p className='pseudoCodeText'>.</p>
          <p className='pseudoCodeText'>.</p>
          <p className='pseudoCodeText'>.</p>
          <p className='pseudoCodeText'>.</p>
          <p className='pseudoCodeText'>.</p>
          <p className='pseudoCodeText'>.</p>
          <p className='pseudoCodeText'>.</p> */}
                </div>
            </div>
        </>
    );
};

export default PseudoCode;
