import { useEffect, useMemo, useRef } from 'react';
import { useGraph } from '../lib/GraphContext';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { Stylesheet } from 'cytoscape';
// @ts-expect-error Made for Javascript version so no type
import cola from 'cytoscape-cola';
// @ts-expect-error Made for Javascript version so no type
import automove from 'cytoscape-automove';
import GraphAnimator from '../lib/GraphAnimator';

cytoscape.use(cola);
cytoscape.use(automove);

export default function VisualGraphComponent() 
{
    const { graph, animator } = useGraph();
    const cy = useRef<cytoscape.Core | null>(null);
    const elements = useMemo(() => graph.toGraph(), [graph]);

    const assignCytoscape = (cyCore: cytoscape.Core) =>
    {
        cy.current = cyCore;

        if (animator.current === null)
        {
            animator.current = new GraphAnimator(cy.current!);
            return;
        }

        animator.current.setCytoscape(cy.current!);
    };

    useEffect(() =>
    {
        cy.current?.on('mouseover', 'node', (e) =>
        {
            if (e.target === null) return;
            if (e.target === cy.current) return;
            e.cy.startBatch();

            const sel = (e.target as cytoscape.NodeSingular).addClass('highlight');
            const edgesAndVertices = sel.outgoers();
            if (!graph.directed) edgesAndVertices.add(sel.incomers());
            
            edgesAndVertices.addClass('highlight');
            e.cy.endBatch();
        }).on('mouseout', 'node', (e) =>
        {
            if (e.target === null) return;
            if (e.target === cy.current) return;
            e.cy.startBatch();

            const sel = (e.target as cytoscape.NodeSingular).removeClass('highlight');
            const edgesAndVertices = sel.outgoers();
            if (!graph.directed) edgesAndVertices.add(sel.incomers());
            
            edgesAndVertices.removeClass('highlight');
            e.cy.endBatch();
        });
    }, [graph]);

    useEffect(() => 
    {
        // @ts-expect-error Made for Javascript version so no type
        cy.current?.automove({ nodesMatching: () => true, reposition: 'viewport' });
        // @ts-expect-error Made for Javascript version so no type
        cy.current?.layout({ name: 'cola', infinite: true }).run();
    }, [elements]);

    return (
        <CytoscapeComponent className='my-auto border-2 border-black rounded h-full' elements={elements} stylesheet={DefaultGraphStyle} cy={assignCytoscape} zoomingEnabled={false} boxSelectionEnabled={false} />
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