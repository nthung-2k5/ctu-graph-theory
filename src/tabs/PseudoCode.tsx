import { Divider } from 'antd';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';
import { useState } from 'react';
const PseudoCode = () => 
{
    const { algorithm } = useGraphTheory();
    const [highlightedLine, setHighlightedLine] = useState<number | null>(0);

    return (
        <div className="border rounded-lg p-4 font-mono font-semibold flex-grow flex flex-col overflow-hidden">
            <p className="italic text-gray-400 text-sm">// Mã giả chương trình...</p>
            <p className="text-gray-400 h-5 text-base"></p>
            <Divider className='my-5'/>
            <div className='px-4 py-1 bg-gray-100 overflow-auto rounded-sm flex-grow scrollbar-thin'>
                {algorithm.pseudocode.map((data, index) => 
                {
                    return (
                        <p
                            className={`pseudoCodeText text-gray-700 text-[16px] my-2 ${highlightedLine === index ? 'bg-yellow-200' : ''}`}
                            style={{ paddingLeft: `${data.tab * 16 * 2 + 12}px` }}
                            key={index}
                            onClick={() => setHighlightedLine(index)}
                        >
                            {data.text}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

export default PseudoCode;
