import EdgeList from './graphs/unweighted/EdgeList';
import UnweightedGraph from './graphs/unweighted/UnweightedGraph';

export default class GraphParser
{
    public static parseUnweighted(input: string, directed: boolean = false): UnweightedGraph
    {
        const lines = input.split('\n');
        
        let graph: UnweightedGraph | null = null;

        try
        {
            const [n, m] = lines[0].split(' ').map(value => parseInt(value));
            if (isNaN(n)) throw new Error();

            graph = new EdgeList(n, directed);

            for (let i = 1; i <= m; i++)
            {
                const edge = parseEdge(lines[i]);
                if (edge === undefined) continue;
    
                graph.addEdge({ u: edge[0], v: edge[1] });
            }
    
            return graph;
        }
        catch
        {
            return graph ?? new EdgeList(0, directed);
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