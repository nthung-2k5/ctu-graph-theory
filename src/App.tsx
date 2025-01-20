import CTULogo from '/public/CTU.svg?react';
import './app.css'
import { Col, Row } from 'antd'
import { useState } from 'react';
import GraphInputTab from './components/tabs/GraphInputTab';
import AlgorithmsTab from './components/tabs/AlgorithmsTab';
import { GraphContext } from './lib/GraphContext';
import GraphDisplayTab from './components/tabs/GraphDisplayTab';
import EdgeList from './lib/graphs/unweighted/EdgeList';
import Graph from './lib/graphs/Graph';

export default function App() 
{
    const [graph, setGraph] = useState<Graph>(new EdgeList());

    const onGraphChanged = (g: Graph) => 
    {
        if (graph.equals(g)) 
        {
            return;
        }

        setGraph(g);
    }

    return (
        <div className='flex flex-col h-screen pb-4'>
            <div className='p-2 border-b flex items-end h-[10vh]'>
                <CTULogo className='h-[7vh] my-auto w-auto' />
            </div>
            <GraphContext.Provider value={{ graph: graph, onGraphChanged }}>
                <Row className='max-h-[calc(90vh-1rem)]  h-[calc(90vh-1rem)] mx-4'>
                    <Col span={8} className='flex h-full'>
                        <GraphInputTab/>
                    </Col>
                    <Col span={8} className='flex h-full px-4'>
                        <GraphDisplayTab/>
                    </Col>
                    <Col span={8} className='flex h-full'>
                        <AlgorithmsTab/>
                    </Col>
                </Row>
            </GraphContext.Provider>
        </div>
    )
}
