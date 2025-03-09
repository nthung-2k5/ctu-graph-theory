import { Editor } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import { useAnimation } from '../lib/context/AnimationContext';
import { editor, Range } from 'monaco-editor';

const ConsoleOutput = () => 
{
    const [logs, setLogs] = useState<string[]>([]);
    const { log: animator } = useAnimation();
    const editorRef = useRef<editor.IStandaloneCodeEditor>();
    const decoration = useRef<editor.IEditorDecorationsCollection>();

    const handleEditorMount = (editor: editor.IStandaloneCodeEditor) =>
    {
        editorRef.current = editor;
        decoration.current = editor.createDecorationsCollection();
    };

    animator.setHandle({
        addLog: (log) => setLogs((logs) => [...logs, log]),
        clearLogs: () => setLogs([])
    });

    useEffect(() => 
    {
        if (logs.length === 0)
        {
            decoration.current?.clear();
            editorRef.current?.revealLineNearTop(1);
        }
        else
        {
            editorRef.current?.revealLineInCenterIfOutsideViewport(logs.length);
            decoration.current?.set([
                {
                    range: new Range(logs.length, 1, logs.length, 1),
                    options: {
                        isWholeLine: true,
                        className: 'code-highlight'
                    }
                }
            ]);
        }
    }, [logs]);

    return (
        <div className="bg-gray-100 text-gray-800 font-mono rounded border border-gray-300 h-full overflow-auto max-w-full w-full">
            <Editor
                defaultLanguage='plaintext'
                value={logs.join('\n')}
                options={{ readOnly: true, fontSize: 12, minimap: { enabled: false } }}
                theme='vs-light'
                className='w-full h-full'
                onMount={handleEditorMount}
            />
        </div>
    );
};

export default ConsoleOutput;