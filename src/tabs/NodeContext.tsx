import { createContext, MutableRefObject, PropsWithChildren, useContext, useRef, useState } from "react";
import { GraphAlgorithm } from "../lib/algorithms/GraphAlgorithm";
import { algos } from "./AlgorithmsTab";
import cytoscape from 'cytoscape';
import { Color } from 'antd/es/color-picker';
import { AggregationColor } from 'antd/es/color-picker/color';

interface NodeContextType 
{
    nodeColor: Color;
    edgeColor: Color;
    textNumberColor: Color;
    range: string;
    nodeRadius: number;
    edgeLength: number;
    algorithm: GraphAlgorithm;
    cy: MutableRefObject<cytoscape.Core | null>;
    downloadPNG: () => void;
    setNodeColor: (color: Color) => void;
    setEdgeColor: (color: Color) => void;
    setNodeRadius: (radius: number) => void;
    setEdgeLength: (length: number) => void;
    setTextNumberColor: (color: Color) => void;
    setAlgorithm: (algo: GraphAlgorithm) => void;
    setRange: (range: string) => void;
}

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export const NodeProvider: React.FC<PropsWithChildren> = ({ children }) => 
{
    const [nodeColor, setNodeColor] = useState(new AggregationColor('#ffffff')); // Màu nút
    const [edgeColor, setEdgeColor] = useState(new AggregationColor('#000000')); // Màu cạnh
    const [nodeRadius, setNodeRadius] = useState(30); // Kích thước nút
    const [edgeLength, setEdgeLength] = useState(100); // Độ dài cạnh
    const [textNumberColor, setTextNumberColor] = useState(new AggregationColor('#000000')); // Màu số của nút
    const [algorithm, setAlgorithm] = useState<GraphAlgorithm>(algos[0]);
    const [range, setRange] = useState("0");

    const cy = useRef<cytoscape.Core | null>(null);

    const downloadPNG = () => 
    {
        if (cy.current) 
        {
            const pngData = cy.current.png({ full: true }); // Lấy PNG từ Cytoscape
            console.log(pngData);
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
        }
    };
  

    return (
        <NodeContext.Provider
            value={{
                nodeColor,
                edgeColor,
                textNumberColor,
                algorithm,
                setAlgorithm,
                setNodeColor,
                setEdgeColor,
                nodeRadius,
                setNodeRadius,
                edgeLength,
                setEdgeLength,
                cy,
                range,
                setRange,
                downloadPNG,
                setTextNumberColor
            }}
        >
            {children}
        </NodeContext.Provider>
    );
};

export const useNode = () => 
{
    const context = useContext(NodeContext);
    if (!context) 
    {
        throw new Error("Nên dùng useNode trong NodeProvider");
    }
    return context;
};
