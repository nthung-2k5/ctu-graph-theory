import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import { useContext, useMemo, useState } from 'react';
import { GraphContext } from './lib/GraphContext';
import LabeledNumber from './components/LabeledNumber';
import GraphConverter from './lib/graphs/unweighted/GraphConverter';
import UnweightedGraph from './lib/graphs/unweighted/UnweightedGraph';

const graphTypes = ["Danh sách cạnh", "Ma trận kề", "Danh sách kề", "Ma trận liên thuộc"];
const graphItems: MenuProps['items'] = graphTypes.map((val, i) => ({ label: <span>{val}</span>, key: i.toString() }));

const edges: [number, number][] = [
    [2, 3],
    [2, 4],
    [3, 4],
    [3, 5],
    [4, 5],
    [5, 6],
    [3, 5],
    [4, 5],
    [5, 6],
    [3, 5],
    [4, 5],
    [5, 6],
    [3, 5],
    [4, 5],
    [5, 6],
    [8, 10]
];

const numVertices = Math.max(...edges.flat()) + 1;
const adjacencyMatrix = Array.from({ length: numVertices }, () => Array(numVertices).fill(0));

edges.forEach(([from, to]) =>
{
    adjacencyMatrix[from][to]++;
    adjacencyMatrix[to][from]++; // Assuming the graph is undirected
});

const adjacencyList: number[][] = Array.from({ length: numVertices }, () => []);

edges.forEach(([from, to]) =>
{
    adjacencyList[from].push(to);
    adjacencyList[to].push(from); // Assuming the graph is undirected
});

// export default function MemoryGraphComponent() 
// {
//     const [graphType, setGraphType] = useState(0);

//     return (
//         <div className='flex flex-col w-full h-full'>
//             <Dropdown menu={{ items: graphItems, onClick: ({ key }) => setGraphType(parseInt(key)) }} trigger={["click"]}>
//                 <a className='ant-dropdown-link mb-2' onClick={e => e.preventDefault()}>
//                     Phương pháp biểu diễn: {graphTypes[graphType]}{' '}<DownOutlined />
//                 </a>
//             </Dropdown>
//             <div className='border-2 border-black rounded p-4 pb-0 mx-auto max-w-full max-h-full scrollbar-thin overflow-auto after:content-[""] after:block after:h-4'>
//                 <EdgeListGraph edges={edges} />
//             </div>
//         </div>
//     );
// }

export default function MemoryGraphComponent() 
{
    const { graph } = useContext(GraphContext);
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