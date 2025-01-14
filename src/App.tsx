import CTULogo from '/public/CTU.svg?react';
import './app.css'
import { Button, Col, Row } from 'antd'
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { ElementDefinition, Stylesheet } from 'cytoscape';
import COSEBilkent from 'cytoscape-cose-bilkent';
import { useRef, useState } from 'react';
import LeftComponent from './LeftComponent';
import { UnweightedGraph } from './lib/Graph';

// const elements: ElementDefinition[] = [
//     { data: { id: 'one', label: 'A' }, position: { x: 100, y: 100 } },
//     { data: { id: 'two', label: 'B' }, position: { x: 400, y: 200 } },
//     { data: { source: 'one', target: 'two' } }
// ];

const defaultGraphStyle: Stylesheet[] = [
    {
        selector: 'node',
        style: {
            "text-valign": "center",
            "text-halign": "center",
            "label": "data(label)",
            backgroundColor: '#F8FAFC',
            "border-style": "solid",
            "border-width": 1,
            "border-color": "#000",
        }
    },
    {
        selector: 'edge',
        style: {
            "line-color": '#000',
            width: 1
        }
    }
]

cytoscape.use(COSEBilkent);

const App = () => {
    const cy = useRef<cytoscape.Core>(null);
    const [performing, setPerforming] = useState(false);
    const [elements, setElements] = useState<ElementDefinition[]>([]);

    const onGraphChanged = (graph: UnweightedGraph) => {
        const newElements: ElementDefinition[] = [];

        const u = graph.oneIndex ? 1 : 0;
        const count = graph.vertexCount + u;

        for (let i = u; i < count; i++) {
            newElements.push({ data: { id: i.toString(), label: i.toString() } });
        }

        for (let i = u; i < count; i++) {
            for (const neighbor of graph.neighbors(i))
            {
                newElements.push({ data: { source: i.toString(), target: neighbor.toString() } });
            }
        }

        setElements(newElements);
    }

    return (
        <div className={'flex flex-col h-screen'}>
            <div className={'p-2 border-b flex items-end h-[10vh]'}>
                <CTULogo className={'h-[7vh] my-auto w-auto'} />
            </div>
            <Row className='h-full'>
                <Col span={8}>
                    <LeftComponent onGraphChanged={onGraphChanged}/>
                </Col>
                <Col span={8} className='flex'>
                    <CytoscapeComponent className='mx-4 my-auto border-2 border-black rounded w-[30vw] h-[85vh]' elements={elements} layout={{name: 'cose-bilkent'}} stylesheet={defaultGraphStyle} cy={(cyCore) => cy.current = cyCore} userPanningEnabled={false} zoomingEnabled={false} autoungrabify={performing} />
                </Col>
                <Col span={8}>
                    <h1>A</h1>
                </Col>
            </Row>
        </div>
    )
}

export default App;
