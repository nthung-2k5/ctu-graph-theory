import { Segmented, Switch, Tabs } from 'antd';
import { Editor } from 'prism-react-editor';
import { BasicSetup } from 'prism-react-editor/setups';
import { useRef, useState, useContext } from 'react';
import { GraphContext } from './lib/GraphContext';
import GraphParser from './lib/GraphParser';

import "prism-react-editor/layout.css"
import "prism-react-editor/themes/github-light.css"
import "prism-react-editor/search.css"

export default function GraphInputTab() {
    const directed = useRef(false);
    const [input, setInput] = useState('');
    const [weighted, setWeighted] = useState(false);
    const { onGraphChanged } = useContext(GraphContext);

    const onInputUpdate = (input: string) => {
        setInput(input);
        onGraphChanged?.(GraphParser.parseUnweighted(input, directed.current));
    };

    return (
        <Tabs items={[
            {
                key: '1',
                label: 'Đồ thị',
                children: (
                    <div className='flex flex-col h-full'>
                        <div className='flex'>
                            <Segmented options={['Vô hướng', 'Có hướng']} onChange={(type) => { directed.current = (type === 'Có hướng'); onInputUpdate(input); }} className='mb-2 w-full' block defaultValue='Vô hướng' />
                        </div>
                        <div className='flex ms-auto mb-2'>
                            <span>{weighted ? "Có trọng số" : "Không có trọng số"}</span>
                            <Switch className='ml-2' onClick={(check) => setWeighted(check)} />
                        </div>

                        <Editor value='' style={{ borderWidth: 1, flexGrow: '1', borderRadius: '0.5rem' }} onUpdate={onInputUpdate} language=''>
                            {editor => <BasicSetup editor={editor} />}
                        </Editor>
                    </div>
                )
            },
        ]} className='expanded-tabs'/>
    );
};