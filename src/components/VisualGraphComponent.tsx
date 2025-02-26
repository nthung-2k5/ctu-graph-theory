import { useEffect, useMemo, useRef } from "react"
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { ElementDefinition, Stylesheet } from "cytoscape";
// @ts-expect-error Made for Javascript version so no type
import cola from "cytoscape-cola";

import ControlBar from "./ControlBar";
import { useAppSelector } from '../lib/context/hooks';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';

cytoscape.use(cola);

export default function VisualGraphComponent() 
{
    const cy = useRef<cytoscape.Core>(null!);
    const { animator } = useGraphTheory();
    const { vertexCount, edges, directed } = useAppSelector(state => state.graph);
    const { nodeColor, edgeColor, labelColor, nodeRadius, edgeLength } = useAppSelector((state) => state.config);

    const assignCytoscape = (core: cytoscape.Core) =>
    {
        cy.current = core;
        animator.graph.setCytoscape(core);
    };

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

    const elements = useMemo(() =>
    {
        const elements: ElementDefinition[] = [];
            
        for (let i = 1; i <= vertexCount; i++) 
        {
            elements.push({ group: 'nodes', data: { id: i.toString(), label: i.toString() } });
        }

        for (let i = 0; i < edges.length; i++)
        {
            const edge = edges[i];
            elements.push({ group: 'edges', data: { id: `${edge.u}-${edge.v}[${i}]`, source: edge.u.toString(), target: edge.v.toString() }, classes: directed ? 'directed' : '' });
        }

        return elements;
    }, [vertexCount, edges, directed]);

    useEffect(() =>
    {
        cy.current.style().selector('node').style({ backgroundColor: nodeColor }).update();
    }, [nodeColor]);

    useEffect(() =>
    {
        cy.current.style().selector('node').style({ color: labelColor }).update();
    }, [labelColor]);

    useEffect(() =>
    {
        cy.current.style().selector('node').style({ width: nodeRadius, height: nodeRadius }).update();
    }, [nodeRadius]);

    useEffect(() =>
    {
        cy.current.style().selector('edge').style({ 'line-color': edgeColor }).update();
    }, [edgeColor]);

    useEffect(() => 
    {
        cy.current.layout({
            name: "cola",
            // @ts-expect-error Config in cola layout
            edgeLength: edgeLength,
        }).run();
    }, [elements, edgeLength]);

    return (
        <div className='border-2 border-black rounded-lg flex flex-col h-full overflow-hidden'>
            <CytoscapeComponent
                className='flex-grow'
                elements={elements}
                stylesheet={DefaultGraphStyle}
                cy={assignCytoscape}
                autoungrabify
                boxSelectionEnabled={false}
            />
            <ControlBar onDownloadClicked={downloadPNG}/>
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
            "label": "data(label)",
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
