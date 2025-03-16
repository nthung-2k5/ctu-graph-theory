import { useEffect, useRef } from "react"
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { EdgeSingular, Stylesheet } from "cytoscape";
// @ts-expect-error Made for Javascript version so no type
import cola from "cytoscape-cola";
// @ts-expect-error Made for Javascript version so no type
import dagre from 'cytoscape-dagre';

import ControlBar from "./ControlBar";
import { useAppSelector } from '../lib/context/hooks';
import { useAnimation } from '../lib/context/AnimationContext';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';

cytoscape.use(cola);
cytoscape.use(dagre);

export default function VisualGraphComponent() 
{
    const cy = useRef<cytoscape.Core>(null!);
    const { graph: animator } = useAnimation();
    const { algorithm } = useGraphTheory();
    const { elements } = useAppSelector(state => state.graph);
    const { nodeColor, edgeColor, labelColor, nodeRadius, edgeLength } = useAppSelector((state) => state.config);

    const downloadPNG = () => 
    {
        const pngData = cy.current.png({ full: true }); // Lấy PNG từ Cytoscape
        const img = new Image();
        img.src = pngData;
    
        img.onload = () => 
        {
            const canvas = document.createElement('canvas');
            canvas.width = img.width + 100; // 100px = padding: 100px
            canvas.height = img.height + 100;
    
            const ctx = canvas.getContext('2d');
            if (ctx) 
            {
                // Vẽ background màu trắng
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
    
                // Vẽ ảnh Cytoscape lên canvas, ảnh này được vẽ ra chính giữa nên công thức phức tạp 
                const x = (canvas.width - img.width) / 2;
                const y = (canvas.height - img.height) / 2;
                ctx.drawImage(img, x, y);
    
                // Tạo link tải xuống
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'graph.png';
                link.click();
            }
        };
    };

    const assignCytoscape = (core: cytoscape.Core) =>
    {
        cy.current = core;
        animator.setCytoscape(core);
    };

    useEffect(() => 
    {
        if (cy.current) 
        {
            cy.current.nodes().forEach(node => 
            {
                node.style('background-color', nodeColor);
            });
        }
    }, [nodeColor]);

    useEffect(() => 
    {
        if (cy.current) 
        {
            cy.current.nodes().forEach(node => 
            {
                node.style('color', labelColor);
            });
        }
    }, [labelColor]);
    
    useEffect(() => 
    {
        if (cy.current) 
        {
            cy.current.nodes().forEach(node => 
            {
                node.style({ width: nodeRadius, height: nodeRadius });
            });
        }
    }, [nodeRadius]);

    useEffect(() => 
    {
        if (cy.current) 
        {
            cy.current.edges().forEach(edge => 
            {
                edge.style('line-color', edgeColor);
            });
        }
    }, [edgeColor]);

    const refreshGraph = () => 
    {
        cy.current.layout({
            name: algorithm.predicate.acyclic === true ? "dagre" : "cola",
            // @ts-expect-error Config in cola layout
            edgeLength: edgeLength,
            rankDir: 'LR',
            spacingFactor: edgeLength / 100,
            // elk: {
            //     'algorithm': 'layered',
            //     'elk.direction': 'RIGHT',
            //     'elk.topdown.nodeType': 'ROOT_NODE',
            //     'elk.spacing.nodeNode': edgeLength,
            //     'elk.layered.spacing.nodeNodeBetweenLayers': edgeLength,
            //     'elk.layered.layering.strategy': 'INTERACTIVE',
            //     'elk.layered.nodePlacement.strategy': 'LINEAR_SEGMENTS',
            //     'elk.layered.nodePlacement.favorStraightEdges': true,
            //     'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES'
            // }
        }).run();
    };

    useEffect(refreshGraph, [elements, edgeLength, algorithm]);

    return (
        <div className='border-2 border-black rounded-lg flex flex-col h-full overflow-hidden'>
            <CytoscapeComponent
                className='flex-grow'
                elements={elements}
                stylesheet={DefaultGraphStyle}
                cy={assignCytoscape}
                boxSelectionEnabled={false}
            />
            <ControlBar onDownloadClicked={downloadPNG} onRefreshClicked={refreshGraph} />
        </div>
    );
}

const DefaultGraphStyle: Stylesheet[] = [
    {
        selector: 'node',
        style: {
            "text-valign": "center",
            "text-halign": "center",
            "font-weight": "bold",
            label: "data(id)",
            backgroundColor: '#F8FAFC',
            "border-style": "solid",
            "border-width": '2rem',
            "border-color": "#000",
        }
    },
    {
        selector: 'edge',
        style: {
            "line-color": '#000',
            width: '2rem',
            "curve-style": "bezier",
            label: (edge: EdgeSingular) => 
            {
                return edge.scratch('label') || edge.data('label');
            },
            "text-background-color": "#fff",
            "text-background-opacity": 1,
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
