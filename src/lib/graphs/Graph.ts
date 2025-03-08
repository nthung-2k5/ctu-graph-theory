import { ReactNode } from 'react';
import UnweightedEdge from './unweighted/Edge';
import WeightedEdge from './weighted/Edge';
import WeightedGraph from './weighted/WeightedGraph';
import UnweightedGraph from './unweighted/UnweightedGraph';

export type InputGraph = UnweightedEdge[] | WeightedEdge[];

export default interface Graph
{
    toMemoryGraph(): ReactNode;
    equals(other: Graph): boolean;
    neighbors(u: number): number[];
    
    get weighted(): boolean;
    get directed(): boolean;
    get vertexCount(): number;
    get edgeCount(): number;
}

export function toGraph<G extends Graph>(
    graph: new(n: number, directed: boolean) => G,
    edges: InputGraph,
    vertexCount: number,
    directed: boolean,
    weighted: boolean): G
{
    const g = new graph(vertexCount, directed);

    if (weighted && g instanceof WeightedGraph)
    {
        const weightedEdges = edges as WeightedEdge[];
        for (const e of weightedEdges)
        {
            g.addEdge(e);
        }
    }
    else if (g instanceof UnweightedGraph)
    {
        const unweightedEdges = edges as UnweightedEdge[];
        for (const e of unweightedEdges)
        {
            g.addEdge(e);
        }
    }

    return g;
}