import { createContext } from 'react';
import UnweightedGraph from './UnweightedGraph';


export const GraphContext = createContext<{
    graph: UnweightedGraph,
    onGraphChanged: (graph: UnweightedGraph) => void
}>({ graph: new UnweightedGraph(), onGraphChanged: () => {} });