import { useGraphTheory } from '../lib/context/GraphTheoryContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useAnimation } from '../lib/context/AnimationContext';

const CodeBlock = () => 
{
    const { algorithm } = useGraphTheory();
    const lines = useMemo(() => algorithm.code, [algorithm]);

    const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
    const editorRef = useRef<editor.IStandaloneCodeEditor>();
    const decoration = useRef<editor.IEditorDecorationsCollection>();
    const monaco = useMonaco()!;
    const { code: codeAnimator } = useAnimation();

    codeAnimator.setHandle({
        currentLine: () => highlightedLine,
        highlightLine: (line: number) => 
        {
            setHighlightedLine(line);
            editorRef.current?.revealLineNearTop(line);
        },
        reset: () => setHighlightedLine(null)
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
            <Editor defaultLanguage='c' options={{ readOnly: true, domReadOnly: true, fontFamily: 'Jetbrains Mono', fontSize: 12, minimap: { enabled: false } }} value={typeof lines === 'string' ? lines : lines.join('\n')} theme='vs-light' className='px-1 py-1 overflow-auto rounded-sm flex-grow scrollbar-thin' onMount={handleEditorMount} />
        </div>
    );
};

export default CodeBlock;
