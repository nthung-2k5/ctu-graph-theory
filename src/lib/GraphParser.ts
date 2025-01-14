import { Edge, UnweightedGraph } from './Graph';

export default class GraphParser
{
    public static parse(input: string): UnweightedGraph
    {
        const lines = input.split('\n');
        
        let graph: UnweightedGraph | null = null;

        try
        {
            const [n, m] = lines[0].split(' ').map(value => parseInt(value));
            graph = new UnweightedGraph(n);

            for (let i = 1; i <= m; i++)
            {
                const edge = parseEdge(lines[i]);
                if (edge === undefined) continue;
    
                graph.addEdge(edge.u, edge.v);
            }
    
            return graph;
        }
        catch
        {
            return graph ?? new UnweightedGraph(0);
        }
        
        function parseEdge(edge: string): Edge | undefined
        {
            try
            {
                const [u, v] = edge.split(' ').map(value => parseInt(value));
                return { u, v } as Edge;
            }
            catch
            {
                return undefined;
            }
        }
    }
}