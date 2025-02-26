import { Divider } from 'antd';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';
import { useEffect, useMemo, useState } from 'react';

const TAB_SIZE = 2;

const PseudoCode = () => 
{
    const { algorithm, animator } = useGraphTheory();
    const lines = useMemo(() => algorithm.pseudocode, [algorithm]);

    const [highlightedLine, setHighlightedLine] = useState<number | null>(0);

    animator.pseudocode.setHandle({
        currentLine: () => highlightedLine,
        highlightLine: setHighlightedLine,
        reset: () => setHighlightedLine(null)
    });

    useEffect(() => setHighlightedLine(null), [lines]);

    return (
        <div className="border rounded-lg p-4 font-mono font-semibold flex-grow flex flex-col overflow-hidden">
            <p className="comment-code text-sm">// Mã giả chương trình...</p>
            <p className="text-gray-400 h-5 text-base"></p>
            <Divider className='my-5'/>
            <div className='px-4 py-1 bg-gray-100 overflow-auto rounded-sm flex-grow scrollbar-thin'>
                {lines.map((data, index) => 
                {
                    return (
                        <p
                            className={`pseudoCodeText flex text-gray-700 pl-3 text-base my-2 ${data.comment ? 'comment-code' : ''} ${highlightedLine === index ? 'bg-yellow-200' : ''}`}
                            key={index}
                            onClick={() => setHighlightedLine(index)}
                        >
                            <pre>{' '.repeat(data.tab * TAB_SIZE)}</pre>{data.text}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

export default PseudoCode;
