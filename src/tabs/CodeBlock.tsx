import { useGraphTheory } from '../lib/context/GraphTheoryContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { editor, Range } from 'monaco-editor';
import { useAnimation } from '../lib/context/AnimationContext';

const CodeBlock = () => 
{
    const { algorithm } = useGraphTheory();
    const lines = useMemo(() => algorithm.code, [algorithm]);

    const [highlightedLine, setHighlightedLine] = useState<number | [number, number] | null>(null);
    const editorRef = useRef<editor.IStandaloneCodeEditor>();
    const decoration = useRef<editor.IEditorDecorationsCollection>();
    const { code: codeAnimator } = useAnimation();

    codeAnimator.setHandle({
        highlightLine: setHighlightedLine,
        reset: () => setHighlightedLine(null)
    });

    const handleEditorMount = (editor: editor.IStandaloneCodeEditor) =>
    {
        editorRef.current = editor;
        decoration.current = editor.createDecorationsCollection();
    };

    useEffect(() => setHighlightedLine(null), [lines]);

    useEffect(() => 
    {
        if (highlightedLine === null)
        {
            decoration.current?.clear();
            editorRef.current?.revealLineNearTop(1);
            return;
        }
        else if (typeof highlightedLine === 'number')
        {
            editorRef.current?.revealLineInCenterIfOutsideViewport(highlightedLine);
            decoration.current?.set([
                {
                    range: new Range(highlightedLine, 1, highlightedLine, 1),
                    options: {
                        isWholeLine: true,
                        className: 'code-highlight'
                    }
                }
            ]);
        }
        else if (Array.isArray(highlightedLine))
        {
            const [start, end] = highlightedLine;
            editorRef.current?.revealLinesInCenterIfOutsideViewport(start, end);
            decoration.current?.set([
                {
                    range: new Range(start, 1, end, 1),
                    options: {
                        isWholeLine: true,
                        className: 'code-highlight'
                    }
                }
            ]);
        }
    }, [highlightedLine]);

    return (
        <div className="border rounded-lg font-mono font-semibold flex-grow flex flex-col overflow-hidden">
            <Editor defaultLanguage='c' options={{ readOnly: true, domReadOnly: true, fontFamily: 'Jetbrains Mono', fontSize: 12, minimap: { enabled: false } }} value={typeof lines === 'string' ? lines : lines.join('\n')} theme='vs-light' className='overflow-auto rounded-sm flex-grow scrollbar-thin' onMount={handleEditorMount} />
        </div>
    );
};

export default CodeBlock;
