import { Divider } from 'antd';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Editor, useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

const DELTA = 40;

const PseudoCode = () => 
{
    const { algorithm, animator } = useGraphTheory();
    const lines = useMemo(() => algorithm.code, [algorithm]);

    const [topDescription, setTopDescription] = useState('');
    const [bottomDescription, setBottomDescription] = useState('');

    const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
    const editorRef = useRef<editor.IStandaloneCodeEditor>();
    const decoration = useRef<editor.IEditorDecorationsCollection>();
    const monaco = useMonaco()!;

    animator.pseudocode.setHandle({
        description: (line: string | [string | undefined, string]) => 
        {
            if (typeof line === 'string')
            {
                setTopDescription(line);
                setBottomDescription('');
            }
            else
            {
                const [top, bottom] = line;
                setTopDescription(top ?? topDescription);
                setBottomDescription(bottom ?? bottomDescription);
            }
        },
        currentLine: () => highlightedLine,
        highlightLine: (line) => 
        {
            setHighlightedLine(line);
            editorRef.current?.revealLineNearTop(line);
        },
        reset: () => 
        {
            setHighlightedLine(null);
            setTopDescription('');
            setBottomDescription('');
        }
    });

    const handleEditorMount = (editor: editor.IStandaloneCodeEditor) =>
    {
        editorRef.current = editor;
        decoration.current = editor.createDecorationsCollection();
    };

    useEffect(() => 
    {
        if (highlightedLine === null)
        {
            decoration.current?.clear();
            return;
        }
        else
        {
            decoration.current?.set([
                {
                    range: new monaco.Range(highlightedLine, 1, highlightedLine, 1),
                    options: {
                        isWholeLine: true,
                        className: 'code-highlight'
                    }
                }
            ])
        }
    }, [highlightedLine, monaco]);

    useEffect(() => setHighlightedLine(null), [lines]);

    return (
        <div className="border rounded-lg p-4 font-mono font-semibold flex-grow flex flex-col overflow-hidden">
            <p className="comment-code text-sm mb-1">// Đoạn mã C tham khảo...</p>
            <div className='h-6 w-full'>
                <AnimatePresence mode='wait'>
                    <motion.p key={topDescription + '[0]'}
                        className="text-base leading-none"
                        initial={{ x: DELTA, opacity: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ x: -DELTA, opacity: 0 }}
                        transition={{ ease: 'easeOut', duration: 0.2 }}
                    >
                        {topDescription}
                    </motion.p>
                </AnimatePresence>
            </div>
            <div className='h-6 w-full'>
                <AnimatePresence mode='wait'>
                    <motion.p key={bottomDescription + '[1]'}
                        className="text-base leading-none"
                        initial={{ x: DELTA, opacity: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ x: -DELTA, opacity: 0 }}
                        transition={{ ease: 'easeOut', duration: 0.2 }}
                    >
                        {bottomDescription}
                    </motion.p>
                </AnimatePresence>
            </div>
            <Divider className='mb-5 mt-2' />
            {/* <div className='px-4 py-1 bg-gray-100 overflow-auto rounded-sm flex-grow scrollbar-thin'>
                {lines.map((data, index) => 
                {
                    return (
                        <p
                            className={`pseudoCodeText flex text-gray-700 pl-3 text-base my-2 ${data.comment ? 'comment-code' : ''} ${highlightedLine === index ? 'bg-yellow-200' : ''}`}
                            key={index}
                        // onClick={() => setHighlightedLine(index)}
                        >
                            <pre>{' '.repeat(data.tab * TAB_SIZE)}</pre>{data.text}
                        </p>
                    );
                })}
            </div> */}
            <Editor defaultLanguage='c' options={{ readOnly: true, domReadOnly: true, fontFamily: 'Jetbrains Mono' }} value={typeof lines === 'string' ? lines : lines.join('\n')} theme='vs-light' className='px-1 py-1 overflow-auto rounded-sm flex-grow scrollbar-thin' onMount={handleEditorMount} />
        </div>
    );
};

export default PseudoCode;
