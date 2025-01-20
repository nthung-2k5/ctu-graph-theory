import { createContext } from 'react';
import Graph from './graphs/Graph';

export const GraphContext = createContext<{
    graph: Graph,
    onGraphChanged: (graph: Graph) => void
}>({ graph: null!, onGraphChanged: () => {} });