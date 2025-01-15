import { Editor } from "prism-react-editor"
import { BasicSetup } from "prism-react-editor/setups"
import { Segmented, Switch } from 'antd'

import "prism-react-editor/prism/languages/c"

import "prism-react-editor/layout.css"
import "prism-react-editor/themes/github-light.css"

// Required by the basic setup
import "prism-react-editor/search.css"
import { UnweightedGraph } from './lib/UnweightedGraph'
import GraphParser from './lib/GraphParser'
import { useRef, useState } from 'react'

const GraphInput = ({onGraphChanged}: Partial<{onGraphChanged: (graph: UnweightedGraph) => void}>) => {
    const directed = useRef(false);
    const [input, setInput] = useState('');
    const [weighted, setWeighted] = useState(false);

    const onInputUpdate = (input: string) => {
        setInput(input);
        onGraphChanged?.(GraphParser.parseUnweighted(input, directed.current));
    };

    return (
        <div className='flex flex-col'>
            <div className='flex'>
                <Segmented options={['Vô hướng', 'Có hướng']} onChange={(type) => { directed.current = (type === 'Có hướng'); onInputUpdate(input); }} className='mb-2 w-full' block defaultValue='Vô hướng' />
            </div>
            <div className='flex ms-auto mb-2'>
                <span>{weighted ? "Có trọng số" : "Không có trọng số"}</span>
                <Switch className='ml-2' onClick={(check) => setWeighted(check)} />
            </div>

            <Editor value='' style={{ borderWidth: 1, height: '69vh', borderRadius: '0.5rem' }} onUpdate={onInputUpdate} language=''>
                {editor => <BasicSetup editor={editor} />}
            </Editor>
        </div>
    );
};

export default GraphInput;