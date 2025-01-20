import { Queue } from 'data-structure-typed';
import EdgeList from './graphs/unweighted/EdgeList';
import UnweightedGraph from './graphs/unweighted/UnweightedGraph';
import Edge from './graphs/unweighted/Edge';

export default class GraphParser
{
    public static parseUnweighted(input: string, directed: boolean = false): UnweightedGraph
    {
        const numbers = new Queue<number>(input.trim().split(/\s+/).map(value =>
        {
            const parsed = parseInt(value);
            return isNaN(parsed) ? undefined : parsed;
        }));
        
        const n = numbers.shift() ?? 0;
        const graph = new EdgeList(n, directed);
        
        const m = numbers.shift() ?? 0;
        for (let i = 1; i <= m; i++)
        {
            const edge = parseEdge();
            if (edge === undefined) continue;

            graph.addEdge(edge);
        }

        return graph;
        
        function parseEdge(): Edge | undefined
        {
            const u = numbers.shift();
            const v = numbers.shift();

            if (u === undefined || v === undefined) return undefined;

            return { u, v };
        }
    }
}