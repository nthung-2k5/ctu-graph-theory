import { createContext, useContext, useState } from "react";

interface NodeContextType {
  nodeColor: string;
  edgeColor: string;
  nodeRadius: number;
  edgeLength: number;
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
        setEdgeLength
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};

export const useColor = () => {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error("Nên dùng useColor trong NodeProvider");
  }
  return context;
};

export const useNode = () => {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error("Nên dùng useNode trong NodeProvider");
  }
  return context;
}
