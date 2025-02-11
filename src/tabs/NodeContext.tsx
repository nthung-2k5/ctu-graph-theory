import { createContext, useContext, useRef, useState } from "react";

interface NodeContextType {
  nodeColor: string;
  edgeColor: string;
  textNumberColor: string;
  nodeRadius: number;
  edgeLength: number;
  cy: any;
  downloadPNG: () => void;
  setNodeColor: (color: string) => void;
  setEdgeColor: (color: string) => void;
  setNodeRadius: (radius: number) => void;
  setEdgeLength: (length: number) => void;
  setTextNumberColor: (color: string) => void;
}

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export const NodeProvider = ({ children }: any) => {
  const [nodeColor, setNodeColor] = useState("#ffffff"); // Màu nút
  const [edgeColor, setEdgeColor] = useState("#000000"); // Màu cạnh
  const [nodeRadius, setNodeRadius] = useState(30); // Kích thước nút
  const [edgeLength, setEdgeLength] = useState(100); // Độ dài cạnh
  const [textNumberColor, setTextNumberColor] = useState('#000000'); // Màu số của nút

  const cy = useRef<cytoscape.Core | null>(null);

  const downloadPNG = () => {
    if (cy.current) {
      const pngData = cy.current.png({ full: true }); // Lấy PNG từ Cytoscape
      const img = new Image();
      img.src = pngData;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width + 100; // 100px = padding: 100px
        canvas.height = img.height + 100;
  
        const ctx = canvas.getContext('2d');
        if (ctx) {
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
        setNodeColor,
        setEdgeColor,
        nodeRadius,
        setNodeRadius,
        edgeLength,
        setEdgeLength,
        cy,
        downloadPNG,
        setTextNumberColor
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};

export const useNode = () => {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error("Nên dùng useNode trong NodeProvider");
  }
  return context;
};
