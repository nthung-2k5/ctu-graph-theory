import CTULogo from '/public/CTU.svg?react';
import './app.css'
import { Col, Row } from 'antd'
import { useRef, useState } from 'react';
import GraphInputTab from './tabs/GraphInputTab';
import AlgorithmsTab from './tabs/AlgorithmsTab';
import { GraphContext } from './lib/GraphContext';
import GraphDisplayTab from './tabs/GraphDisplayTab';
import EdgeList from './lib/graphs/unweighted/EdgeList';
import Graph from './lib/graphs/Graph';
import GraphAnimator from './lib/GraphAnimator';
import { NodeProvider } from './tabs/NodeContext';

export default function App() 
{
    const [graph, setGraph] = useState<Graph>(new EdgeList());
    const [animating, setAnimating] = useState(false);
    const animator = useRef<GraphAnimator>(null!);

    const setGraphIfNeq = (g: Graph) =>
    {
        if (!g.equals(graph))
        {
            setGraph(g);
        }
    }

    return (
        <NodeProvider>
            <div className='flex flex-col h-screen pb-4'>
                <div className='p-2 border-b flex items-end h-[10vh]'>
                    <CTULogo className='h-[7vh] my-auto w-auto' />
                </div>
                <GraphContext.Provider value={{ graph, setGraph: setGraphIfNeq, animator, animating, setAnimating }}>
                    <Row className='max-h-[calc(90vh-1rem)]  h-[calc(90vh-1rem)] mx-4'>
                        <Col span={5} className='flex h-full'>
                            <GraphInputTab/>
                        </Col>
                        <Col span={12} className='flex h-full px-4'>
                            <GraphDisplayTab/>
                        </Col>
                        <Col span={7} className='flex h-full'>
                            <AlgorithmsTab/>
                        </Col>
                    </Row>
                </GraphContext.Provider>
            </div>
        </NodeProvider>
    )
}
