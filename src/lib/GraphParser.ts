import { ElementDefinition } from 'cytoscape';
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

    public static toCytoscapeGraph(graph: UnweightedGraph): ElementDefinition[]
    {
        const newElements: ElementDefinition[] = [];
        
        const u = graph.oneIndex ? 1 : 0;
        const count = graph.vertexCount + u;

        for (let i = u; i < count; i++) {
            newElements.push({ data: { id: i.toString(), label: i.toString() } });
        }

        const mat = graph.matrix;

        if (graph.directed) {
            for (let i = 0; i < graph.vertexCount; i++) {
                for (let j = 0; j < graph.vertexCount; j++) {
                    for (let k = 0; k < mat[i][j]; k++) {
                        newElements.push({ data: { source: i.toString(), target: j.toString() }, classes: 'directed' });
                    }
                }
            }
        }
        else {
            for (let i = 0; i < graph.vertexCount; i++) {
                for (let k = 0; k < mat[i][i] / 2; k++) {
                    newElements.push({ data: { source: i.toString(), target: i.toString() } });
                }
    
                for (let j = i + 1; j < graph.vertexCount; j++) {
                    for (let k = 0; k < mat[i][j]; k++) {
                        newElements.push({ data: { source: i.toString(), target: j.toString() } });
                    }
                }
            }
        }

        return newElements;
    }
}