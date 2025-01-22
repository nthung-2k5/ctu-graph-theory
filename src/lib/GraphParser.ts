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
        }).filter(Boolean));
        
        const n = numbers.shift();
        if (n === undefined || n <= 0) return new EdgeList(0, directed);

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
            if (u === undefined) return undefined;

            const v = numbers.shift();
            if (v === undefined) return undefined;

            return { u, v };
        }
    }
}