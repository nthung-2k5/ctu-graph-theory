import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import { useMemo, useState } from 'react';
import LabeledNumber from './LabeledNumber';
import UnweightedGraph from '../lib/graphs/unweighted/UnweightedGraph';
import EdgeList from '../lib/graphs/unweighted/EdgeList';
import AdjacencyMatrix from '../lib/graphs/unweighted/AdjacencyMatrix';
import AdjacencyList from '../lib/graphs/unweighted/AdjacencyList';
import IncidenceMatrix from '../lib/graphs/unweighted/IncidenceMatrix';
import { useAppSelector } from '../lib/context/hooks';
import { toGraph } from '../lib/graphs/Graph';

const graphTypes = ["Danh sách cạnh", "Ma trận kề", "Danh sách kề", "Ma trận liên thuộc"];
const graphItems: MenuProps['items'] = graphTypes.map((val, i) => ({ label: <span>{val}</span>, key: i.toString() }));

const graphConstructors: (new(n: number, directed: boolean) => UnweightedGraph)[] = [EdgeList, AdjacencyMatrix, AdjacencyList, IncidenceMatrix];

export default function MemoryGraphComponent() 
{
    const { vertexCount, edges, directed } = useAppSelector(state => state.graph);
    const [graphType, setGraphType] = useState(0);
    
    const convertedGraph = useMemo(() =>
    {
        return toGraph(graphConstructors[graphType], edges, vertexCount, directed, false);
    }, [graphType, vertexCount, edges, directed]);

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
                        <LabeledNumber label='n' value={vertexCount} />
                        <LabeledNumber label='m' value={edges.length} />
                    </div>
                </div>
            </div>
        </div>
    );
}