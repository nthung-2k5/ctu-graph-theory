import { Button, Segmented, Switch, Tabs } from "antd";
import { Editor } from "prism-react-editor";
import { BasicSetup } from "prism-react-editor/setups";
import { useEffect, useRef, useState } from "react";

import "prism-react-editor/layout.css";
import "prism-react-editor/themes/github-light.css";
import "prism-react-editor/search.css";
import GraphOption from "./GraphOption";
import QueueDisplay, { QueueDisplayHandle } from '../components/data_structures/QueueDisplay';
import StackDisplay, { StackDisplayHandle } from '../components/data_structures/StackDisplay';
import ListDisplay, { ListDisplayHandle } from '../components/data_structures/ListDisplay';
import { useAppDispatch } from '../lib/context/hooks';
import { setDirected, setGraph } from '../lib/context/graphSlice';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';

export default function GraphInputTab() 
{
    const [input, setInput] = useState('');
    const [weighted, setWeighted] = useState(false);
    const { playing } = useGraphTheory();

    const dispatch = useAppDispatch();

    const queueRef = useRef<QueueDisplayHandle>(null!);
    const stackRef = useRef<StackDisplayHandle>(null!);
    const listRef = useRef<ListDisplayHandle>(null!);

    useEffect(() =>
    {
        dispatch(setGraph({ input, weighted }))
    }, [dispatch, input, weighted]);

    return (
        <Tabs
            items={[
                {
                    key: "1",
                    label: "Thiết lập đồ thị",
                    children: (
                        <div className="flex flex-col h-full">
                            <div className="flex">
                                <Segmented
                                    disabled={playing}
                                    options={["Vô hướng", "Có hướng"]}
                                    onChange={(type) => dispatch(setDirected(type === "Có hướng"))}
                                    className="mb-2 w-full"
                                    block
                                    defaultValue="Vô hướng"
                                />
                            </div>

                            <div className="flex ms-auto mb-2">
                                <span>{weighted ? "Có trọng số" : "Không có trọng số"}</span>
                                <Switch
                                    disabled={playing}
                                    className="ml-2"
                                    onClick={setWeighted}
                                />
                            </div>

                            <Editor
                                value=''
                                readOnly={playing}
                                style={{
                                    borderWidth: "1px",
                                    flexGrow: "1",
                                    borderRadius: "0.5rem",
                                    marginBottom: "1rem"
                                }}
                                onUpdate={setInput}
                                language=""
                            >
                                {(editor) => <BasicSetup editor={editor} />}
                            </Editor>
                            <GraphOption/>
                        </div>
                    ),
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
            ]}
            className="expanded-tabs"
        />
    );
}
