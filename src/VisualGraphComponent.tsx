import { useContext, useEffect, useMemo, useRef } from 'react';
import { GraphContext } from './lib/GraphContext';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { Stylesheet } from 'cytoscape';
// @ts-expect-error Made for Javascript version so no type
import cola from 'cytoscape-cola';
// @ts-expect-error Made for Javascript version so no type
import automove from 'cytoscape-automove';

cytoscape.use(cola);
cytoscape.use(automove);

export default function VisualGraphComponent() 
{
    const cy = useRef<cytoscape.Core>(null!);
    const { graph } = useContext(GraphContext);

    const elements = useMemo(() => graph.toGraph(), [graph]);

    useEffect(() =>
    {
        cy.current.on('mouseover', 'node', (e) =>
        {
            if (e.target === null) return;
            if (e.target === cy) return;
            e.cy.startBatch();
            const sel = (e.target as cytoscape.NodeSingular).addClass('highlight');
            
            (graph.directed ? sel.outgoers() : sel.connectedEdges()).addClass('highlight');
            e.cy.endBatch();
        }).on('mouseout', 'node', (e) =>
        {
            if (e.target === null) return;
            if (e.target === cy) return;
            e.cy.startBatch();
            const sel = (e.target as cytoscape.NodeSingular).removeClass('highlight');

            (graph.directed ? sel.outgoers() : sel.connectedEdges()).removeClass('highlight');
            e.cy.endBatch();
        }).unbind('layoutready').bind('layoutready', () =>
        {
            cy.current?.fit();
            cy.current?.center();
        });
    }, [graph.directed]);

    const r = useRef<HTMLDivElement>(null);

    useEffect(() => 
    {
        cy.current.automove({ nodesMatching: () => true, reposition: 'viewport' });
        cy.current?.layout({ name: 'cola', infinite: true }).run();
    }, [elements]);

    return (
        <div className='my-auto border-2 border-black rounded h-full' ref={r}>
            <CytoscapeComponent className='h-full' elements={elements} stylesheet={DefaultGraphStyle} cy={(cyCore) => cy.current = cyCore} zoomingEnabled={false} boxSelectionEnabled={false} />
        </div>
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
    },
    {
        selector: '.highlight',
        style: {
            "border-width": 2,
            "line-outline-width": 1,
        }
    }
];