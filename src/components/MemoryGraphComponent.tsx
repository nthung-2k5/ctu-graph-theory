import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import { useMemo, useState } from 'react';
import { useGraph } from '../lib/GraphContext';
import LabeledNumber from './LabeledNumber';
import GraphConverter from '../lib/graphs/unweighted/GraphConverter';
import UnweightedGraph from '../lib/graphs/unweighted/UnweightedGraph';

const graphTypes = ["Danh sách cạnh", "Ma trận kề", "Danh sách kề", "Ma trận liên thuộc"];
const graphItems: MenuProps['items'] = graphTypes.map((val, i) => ({ label: <span>{val}</span>, key: i.toString() }));

export default function MemoryGraphComponent() 
{
    const { graph } = useGraph();
    const [graphType, setGraphType] = useState(0);
    
    const convertedGraph = useMemo(() =>
    {
        switch (graphType)
        {
            case 0:
                return GraphConverter.toEdgeList(graph as UnweightedGraph);
            case 1:
                return GraphConverter.toAdjacencyMatrix(graph as UnweightedGraph);
            case 2:
                return GraphConverter.toAdjacencyList(graph as UnweightedGraph);
            case 3:
                return GraphConverter.toIncidenceMatrix(graph as UnweightedGraph);
            default:
                throw new Error("Invalid graph type");
        }
    }, [graph, graphType]); 

    return (
        <div className='flex flex-col w-full h-full'>
            <Dropdown menu={{ items: graphItems, onClick: ({ key }) => setGraphType(parseInt(key)) }} trigger={["click"]}>
                <a className='ant-dropdown-link mb-2' onClick={e => e.preventDefault()}>
                    Phương pháp biểu diễn: {graphTypes[graphType]}{' '}<DownOutlined />
                </a>
            </Dropdown>
            <div className='border-2 border-black rounded p-4 pb-0 mx-auto max-w-full max-h-full scrollbar-thin overflow-auto after:content-[""] after:block after:h-4'>
                <div className='flex'>
                    { convertedGraph.toMemoryGraph() }
                    <div className='flex-shrink ms-24 text-center'>
                        <LabeledNumber label='n' value={graph.vertexCount} />
                        <LabeledNumber label='m' value={graph.edgeCount} />
                    </div>
                </div>
            </div>
        </div>
    );
}