import CTULogo from '/public/CTU.svg?react';
import './app.css'
import { Col, Row } from 'antd'
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { ElementDefinition, Stylesheet } from 'cytoscape';
// @ts-expect-error Made for Javascript version so no type
import COSEBilkent from 'cytoscape-cose-bilkent';
import { useEffect, useRef, useState } from 'react';
import LeftComponent from './LeftComponent';
import UnweightedGraph from './lib/UnweightedGraph';
import AlgorithmsComponent from './AlgorithmsComponent';

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
            width: 1,
            "curve-style": "bezier"
        }
    },
    {
        selector: 'edge.directed',
        style: {
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#000",
            "arrow-scale": 1.5
        }
    }
]

cytoscape.use(COSEBilkent);

export default function App() {
    const cy = useRef<cytoscape.Core | null>(null);
    const [performing, setPerforming] = useState(false);
    const [elements, setElements] = useState<ElementDefinition[]>([]);
    const graphRef = useRef(new UnweightedGraph());

    const onGraphChanged = (graph: UnweightedGraph) => {
        if (graphRef.current.equals(graph)) {
            return;
        }

        graphRef.current = graph;

        const newElements: ElementDefinition[] = [];

        const u = graph.oneIndex ? 1 : 0;
        const count = graph.vertexCount + u;

        for (let i = u; i < count; i++) {
            newElements.push({ data: { id: i.toString(), label: i.toString() } });
        }

        const mat = graph.matrix;

        if (graph.directed) {
            for (let i = 0; i < graph.vertexCount; i++) {
                for (let j = 0; j < graph.vertexCount; j++) {
                    for (let k = 0; k < mat[i][j]; k++) {
                        newElements.push({ data: { source: i.toString(), target: j.toString() }, classes: 'directed' });
                    }
                }
            }
        }
        else {
            for (let i = 0; i < graph.vertexCount; i++) {
                for (let k = 0; k < mat[i][i] / 2; k++) {
                    newElements.push({ data: { source: i.toString(), target: i.toString() } });
                }
    
                for (let j = i + 1; j < graph.vertexCount; j++) {
                    for (let k = 0; k < mat[i][j]; k++) {
                        newElements.push({ data: { source: i.toString(), target: j.toString() } });
                    }
                }
            }
        }

        setElements(newElements);
    }

    useEffect(() => {
        cy.current?.pan({ x: 100, y: 300})
    }, []);

    useEffect(() => {
        cy.current?.layout({ name: 'cose-bilkent' }).run();
    }, [elements])

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
                    <CytoscapeComponent className='mx-4 my-auto border-2 border-black rounded w-[30vw] h-[85vh]' elements={elements} stylesheet={defaultGraphStyle} cy={(cyCore) => cy.current = cyCore} zoomingEnabled={false} autoungrabify={performing} />
                </Col>
                <Col span={8}>
                    <AlgorithmsComponent/>
                </Col>
            </Row>
        </div>
    )
}
