import { Segmented, Switch, Tabs } from "antd";
import { Editor } from "prism-react-editor";
import { BasicSetup } from "prism-react-editor/setups";
import { useEffect, useRef, useState } from "react";

import "prism-react-editor/layout.css";
import "prism-react-editor/themes/github-light.css";
import "prism-react-editor/search.css";
import GraphOption from "./GraphOption";
import { useAppDispatch, useAppSelector } from '../lib/context/hooks';
import { setDirected, setGraph } from '../lib/context/graphSlice';
import ConsoleLog from './ConsoleOutput';
import { useAnimation } from '../lib/context/AnimationContext';

export default function GraphInputTab() 
{
    const inputRef = useRef('');
    const state = useAppSelector(state => state.graph);
    
    const [activeTab, setActiveTab] = useState('1');
    const { playing } = useAnimation();
    
    useEffect(() => 
    {
        if (playing) 
        {
            setActiveTab('2');
        }
    }, [playing]);

    const dispatch = useAppDispatch();

    const pushGraph = (input: string = inputRef.current, weighted: boolean = state.weighted) =>
    {
        inputRef.current = input;
        dispatch(setGraph({ input, weighted }));
    }

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
                                    options={["Vô hướng", "Có hướng"]}
                                    onChange={(type) => 
                                    {
                                        dispatch(setDirected(type === "Có hướng"));
                                    }}
                                    className="mb-2 w-full"
                                    block
                                    defaultValue="Vô hướng"
                                />
                            </div>

                            <div className="flex ms-auto mb-2">
                                <span>{state.weighted ? "Có trọng số" : "Không có trọng số"}</span>
                                <Switch
                                    className="ml-2"
                                    onClick={(value) => pushGraph(undefined, value)}
                                />
                            </div>

                            <Editor
                                value=''
                                style={{
                                    borderWidth: "1px",
                                    flexGrow: "1",
                                    borderRadius: "0.5rem",
                                    marginBottom: "1rem"
                                }}
                                onUpdate={(value) => pushGraph(value)}
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
                    label: 'Log',
                    children: (
                        <div className='h-full w-full overflow-auto'>
                            <ConsoleLog />
                        </div>
                    ),
                    forceRender: true
                }
            ]}
            className="expanded-tabs" activeKey={activeTab} onChange={setActiveTab}
        />
    );
}
