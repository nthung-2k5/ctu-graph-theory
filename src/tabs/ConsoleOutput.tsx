import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import { useAnimation } from '../lib/context/AnimationContext';

const ConsoleOutput = () => 
{
    const [logs, setLogs] = useState<string[]>([]);
    const { log: animator } = useAnimation();

    animator.setHandle({
        addLog: (log) => setLogs((logs) => [...logs, log]),
        clearLogs: () => setLogs([])
    });

    return (
        <div className="bg-gray-100 text-gray-800 font-mono rounded border border-gray-300 h-full overflow-auto max-w-full w-full">
            <Editor
                defaultLanguage='plaintext'
                value={logs.join('\n')}
                options={{ readOnly: true, fontSize: 12, minimap: { enabled: false } }}
                theme='vs-light'
                className='w-full h-full'
            />
        </div>
    );
};

export default ConsoleOutput;