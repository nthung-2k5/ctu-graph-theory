import { useEffect, useMemo, useRef } from 'react';
import { useGraph } from '../lib/GraphContext';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { Stylesheet } from 'cytoscape';
// @ts-expect-error Made for Javascript version so no type
import cola from 'cytoscape-cola';
import GraphAnimator from '../lib/GraphAnimator';

cytoscape.use(cola);

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
        // cy.current?.on('mouseover', 'node', (e) =>
        // {
        //     if (e.target === null) return;
        //     if (e.target === cy.current) return;
        //     e.cy.startBatch();

        //     const sel = (e.target as cytoscape.NodeSingular).addClass('highlight');
        //     const edgesAndVertices = sel.outgoers();
        //     if (!graph.directed) edgesAndVertices.add(sel.incomers());
            
        //     edgesAndVertices.addClass('highlight');
        //     e.cy.endBatch();
        // }).on('mouseout', 'node', (e) =>
        // {
        //     if (e.target === null) return;
        //     if (e.target === cy.current) return;
        //     e.cy.startBatch();

        //     const sel = (e.target as cytoscape.NodeSingular).removeClass('highlight');
        //     const edgesAndVertices = sel.outgoers();
        //     if (!graph.directed) edgesAndVertices.add(sel.incomers());
            
        //     edgesAndVertices.removeClass('highlight');
        //     e.cy.endBatch();
        // });
    }, [graph]);

    useEffect(() => 
    {
        cy.current?.layout({ name: 'cola' }).run();
    }, [elements]);

    return (
        <CytoscapeComponent className='my-auto border-2 border-black rounded h-full' elements={elements} stylesheet={DefaultGraphStyle} cy={assignCytoscape} autoungrabify boxSelectionEnabled={false} />
    );
}

const DefaultGraphStyle: Stylesheet[] = [
    {
        selector: 'node',
        style: {
            "text-valign": "center",
            "text-halign": "center",
            "font-weight": "bold",
            "label": "data(label)",
            backgroundColor: '#F8FAFC',
            "border-style": "solid",
            "border-width": '3rem',
            "border-color": "#000",
        }
    },
    {
        selector: 'edge',
        style: {
            "line-color": '#000',
            width: '3rem',
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