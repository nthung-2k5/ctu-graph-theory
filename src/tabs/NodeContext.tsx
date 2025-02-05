import { createContext, useContext, useRef, useState } from "react";

interface NodeContextType {
  nodeColor: string;
  edgeColor: string;
  nodeRadius: number;
  edgeLength: number;
  cy: any;
  downloadPNG: () => void;
  setNodeColor: (color: string) => void;
  setEdgeColor: (color: string) => void;
  setNodeRadius: (radius: number) => void;
  setEdgeLength: (length: number) => void;
}

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export const NodeProvider = ({ children }: any) => {
  const [nodeColor, setNodeColor] = useState("Màu đen"); // Màu nút
  const [edgeColor, setEdgeColor] = useState("Màu đen"); // Màu cạnh
  const [nodeRadius, setNodeRadius] = useState(30); // Kích thước nút
  const [edgeLength, setEdgeLength] = useState(100); // Độ dài cạnh

  const cy = useRef<cytoscape.Core | null>(null);

  const downloadPNG = () => {
    if (cy.current) {
      const pngData = cy.current.png();  // Lấy dữ liệu PNG từ Cytoscape
      const link = document.createElement('a');
      link.href = pngData;
      link.download = 'graph.png';  // Đặt tên file tải về
      link.click();  // Mô phỏng click để tải xuống
    }
  };

  return (
    <NodeContext.Provider
      value={{
        nodeColor,
        edgeColor,
        setNodeColor,
        setEdgeColor,
        nodeRadius,
        setNodeRadius,
        edgeLength,
        setEdgeLength,
        cy,
        downloadPNG
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
