import CTULogo from '/public/CTU.svg?react';
import './app.css'
import { Col, Row } from 'antd'
import cytoscape from 'cytoscape';
// @ts-expect-error Made for Javascript version so no type
import COSEBilkent from 'cytoscape-cose-bilkent';
import { useState } from 'react';
import GraphInputTab from './GraphInputTab';
import UnweightedGraph from './lib/UnweightedGraph';
import AlgorithmsTab from './AlgorithmsTab';
import { GraphContext } from './lib/GraphContext';
import GraphDisplayTab from './GraphDisplayTab';

cytoscape.use(COSEBilkent);

export default function App() {
    const [graph, setGraph] = useState(new UnweightedGraph());

    const onGraphChanged = (g: UnweightedGraph) => {
        if (graph.equals(g)) {
            return;
        }

        setGraph(g);
    }

    return (
        <div className={'flex flex-col h-screen pb-4'}>
            <div className={'p-2 border-b flex items-end h-[10vh]'}>
                <CTULogo className={'h-[7vh] my-auto w-auto'} />
            </div>
            <GraphContext.Provider value={{ graph: graph, onGraphChanged }}>
                <Row className='h-full mx-4'>
                    <Col span={8}>
                        <GraphInputTab/>
                    </Col>
                    <Col span={8} className='flex'>
                        <GraphDisplayTab/>
                    </Col>
                    <Col span={8}>
                        <AlgorithmsTab/>
                    </Col>
                </Row>
            </GraphContext.Provider>
        </div>
    )
}
