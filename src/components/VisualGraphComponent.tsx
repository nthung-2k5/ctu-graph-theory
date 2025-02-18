import { useEffect, useMemo } from "react";
import { useGraph } from "../lib/GraphContext";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { Stylesheet } from "cytoscape";
// @ts-expect-error Made for Javascript version so no type
import cola from "cytoscape-cola";
import GraphAnimator from "../lib/GraphAnimator";
import { useNode } from "../tabs/NodeContext";

// Khắc phục lag, giới hạn số lần re-render lại theo thời gian khi cập nhật độ dài cạnh
import debounce from "lodash.debounce";
import ControlBar from "./ControlBar";

cytoscape.use(cola);

export default function VisualGraphComponent() 
{
    const { graph, animator } = useGraph();
    //   const cy = useRef<cytoscape.Core | null>(null);
    const elements = useMemo(() => graph.toGraph(), [graph]);

    const { nodeColor, edgeColor, textNumberColor, nodeRadius, edgeLength, cy } = useNode();

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

    const updateGraphStyle = () => 
    {
        if (!cy.current) return;
    
        cy.current
            .style()
            .selector("node")
            .style({
                backgroundColor: nodeColor.toCssString(),
                color: textNumberColor.toCssString(),
                width: nodeRadius,
                height: nodeRadius,
            })
            .selector("edge")
            .style({
                "line-color": edgeColor.toCssString(),
                "curve-style": "bezier",
            })
            .update();
    };

    useEffect(() => 
    {
        updateGraphStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodeColor, edgeColor, nodeRadius, textNumberColor]);

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
        if (cy.current) 
        {
            if (cy.current) 
            {
                const updateLayout = debounce(() => 
                {
                    cy.current?.layout({
                        name: "cola",
                        // @ts-expect-error Config in cola layout
                        edgeLength: edgeLength,
                    }).run();
                }, 100);

                updateLayout();

                // Clean up function
                return () => 
                {
                    updateLayout.cancel();
                };
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <ControlBar animator={animator} />
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
