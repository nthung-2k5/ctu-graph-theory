import UnweightedGraph from './UnweightedGraph';

export default class GraphParser
{
    public static parseUnweighted(input: string, directed: boolean = false): UnweightedGraph
    {
        const lines = input.split('\n');
        
        let graph: UnweightedGraph | null = null;

        try
        {
            const [n, m] = lines[0].split(' ').map(value => parseInt(value));
            graph = new UnweightedGraph(n, directed);

            for (let i = 1; i <= m; i++)
            {
                const edge = parseEdge(lines[i]);
                if (edge === undefined) continue;
    
                graph.addEdge(edge[0], edge[1]);
            }
    
            return graph;
        }
        catch
        {
            return graph ?? new UnweightedGraph(0, directed);
        }
        
        function parseEdge(edge: string): [number, number] | undefined
        {
            try
            {
                return edge.split(' ').map(value => parseInt(value)) as [number, number];
            }
            catch
            {
                return undefined;
            }
        }
    }
}