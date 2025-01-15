import { useContext, useEffect, useMemo, useRef } from 'react';
import { GraphContext } from './lib/GraphContext';
import GraphParser from './lib/GraphParser';
import CytoscapeComponent from 'react-cytoscapejs';
import { Stylesheet } from 'cytoscape';

export default function VisualGraphComponent() {
    const cy = useRef<cytoscape.Core | null>(null);
    const { graph } = useContext(GraphContext);

    useEffect(() => {
        cy.current?.pan({ x: 100, y: 300});
    }, []);

    const elements = useMemo(() => GraphParser.toCytoscapeGraph(graph), [graph]);

    useEffect(() => {
        cy.current?.layout({ name: 'cose-bilkent' }).run();
    }, [elements]);

    return (
        <CytoscapeComponent className='my-auto border-2 border-black rounded h-full' elements={elements} stylesheet={DefaultGraphStyle} cy={(cyCore) => cy.current = cyCore} zoomingEnabled={false} />
    );
}

const DefaultGraphStyle: Stylesheet[] = [
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
];