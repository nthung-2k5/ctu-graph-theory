import AdjacencyList from './AdjacencyList';
import AdjacencyMatrix from './AdjacencyMatrix';
import EdgeList from './EdgeList';
import IncidenceMatrix from './IncidenceMatrix';
import UnweightedGraph from './UnweightedGraph';

export default class GraphConverter
{
    public static toEdgeList(graph: UnweightedGraph): EdgeList
    {
        return GraphConverter._populateGraph(EdgeList, graph);
    }

    public static toAdjacencyMatrix(graph: UnweightedGraph): AdjacencyMatrix
    {
        return GraphConverter._populateGraph(AdjacencyMatrix, graph);
    }

    public static toAdjacencyList(graph: UnweightedGraph): AdjacencyList
    {
        return GraphConverter._populateGraph(AdjacencyList, graph);
    }

    public static toIncidenceMatrix(graph: UnweightedGraph): IncidenceMatrix
    {
        return GraphConverter._populateGraph(IncidenceMatrix, graph);
    }

    private static _populateGraph<Graph extends UnweightedGraph>(type: { new(n: number, directed: boolean): Graph ;}, from: UnweightedGraph): Graph
    {
        const graph = new type(from.vertexCount, from.directed);
        const edges = from.edges;

        for (const e of edges) 
        {
            graph.addEdge(e);
        }

        return graph;
    }
}