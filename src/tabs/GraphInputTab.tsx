import { Button, Segmented, Switch, Tabs } from 'antd';
import { Editor } from 'prism-react-editor';
import { BasicSetup } from 'prism-react-editor/setups';
import { useRef, useState } from 'react';
import { useGraph } from '../lib/GraphContext';
import GraphParser from '../lib/GraphParser';

import "prism-react-editor/layout.css"
import "prism-react-editor/themes/github-light.css"
import "prism-react-editor/search.css"
import QueueDisplay, { QueueDisplayHandle } from '../components/data_structures/QueueDisplay';
import StackDisplay, { StackDisplayHandle } from '../components/data_structures/StackDisplay';
import ListDisplay, { ListDisplayHandle } from '../components/data_structures/ListDisplay';

export default function GraphInputTab() 
{
    const directed = useRef(false);
    const [input, setInput] = useState('');
    const [weighted, setWeighted] = useState(false);
    const { animating, setGraph } = useGraph();
    const queueRef = useRef<QueueDisplayHandle>(null!);
    const stackRef = useRef<StackDisplayHandle>(null!);
    const listRef = useRef<ListDisplayHandle>(null!);

    const onInputUpdate = (input: string) => 
    {
        setInput(input);
        setGraph(GraphParser.parseUnweighted(input, directed.current));
    };

    return (
        <Tabs items={[
            {
                key: '1',
                label: 'Nhập đồ thị',
                children: (
                    <div className='flex flex-col h-full'>
                        <div className='flex'>
                            <Segmented disabled={animating} options={['Vô hướng', 'Có hướng']} onChange={(type) => { directed.current = (type === 'Có hướng'); onInputUpdate(input); }} className='mb-2 w-full' block defaultValue='Vô hướng' />
                        </div>
                        <div className='flex ms-auto mb-2'>
                            <span>{weighted ? "Có trọng số" : "Không có trọng số"}</span>
                            <Switch disabled={animating} className='ml-2' onClick={(check) => setWeighted(check)} />
                        </div>

                        <Editor value='' readOnly={animating} style={{ borderWidth: 1, flexGrow: '1', borderRadius: '0.5rem' }} onUpdate={onInputUpdate} language=''>
                            {editor => <BasicSetup editor={editor} />}
                        </Editor>
                    </div>
                )
            },
            {
                key: '2',
                label: 'Cấu trúc dữ liệu',
                children: (
                    <div>
                        <p>Stack</p>
                        <StackDisplay ref={stackRef}/>
                        <p>Queue</p>
                        <QueueDisplay ref={queueRef}/>
                        <p>List</p>
                        <ListDisplay length={100} ref={listRef}/>
                        <Button type='primary' onClick={() => { queueRef.current.push(Math.round(Math.random() * 10)); listRef.current.pushBack(Math.round(Math.random() * 10)); stackRef.current.push(Math.round(Math.random() * 10)); }}>Test</Button>
                        <Button type='primary' onClick={() => { queueRef.current.pop(); listRef.current.popBack(); stackRef.current.pop(); }}>Out</Button>
                    </div>
                )
            }
        ]} className='expanded-tabs'/>
    );
};