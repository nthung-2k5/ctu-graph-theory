import { UnweightedGraph } from '../UnweightedGraph';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';

export default class RecursionDFS extends TraversalAlgorithm
{
    public override get code(): string
    {
        return `int mark[MAX_N];

void DFS(Graph* G, int u) {
    mark[u] = 1;

    for (int v = 1; v <= n; v++)
        if (adjacent(G, u, v) && !mark[v])
            DFS(G, v);
}`;
    }

    public get name()
    {
        return 'Duyệt theo chiều sâu (DFS) bằng đệ quy';
    }
    
    *_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[], traverseOrder: number[]): IterableIterator<AlgorithmStep>
    {
        yield { codeLine: 3, log: `DFS(G, ${startVertex})` };

        visited[startVertex] = true;
        traverseOrder.push(startVertex);

        yield {
            colorVertex: [startVertex, 'red'],
            colorEdge: parent[startVertex] !== -1 ? [parent[startVertex], startVertex, 'red'] : undefined,
            codeLine: 4,
            log: `mark[${startVertex}] = true`
        };

        yield { codeLine: 6, log: `v = 1` };
        for (let v = 1; v <= g.vertexCount; v++)
        {
            yield { codeLine: 7, log: `G->A[${startVertex}][${v}] = ${g.matrix[startVertex][v]}, mark[${v}] = ${visited[v]}` };

            if (g.matrix[startVertex][v] && !visited[v])
            {
                yield {
                    colorVertex: [v, 'orange'],
                    colorEdge: [startVertex, v, 'orange'],
                    codeLine: 8,
                    log: `Đệ quy DFS`
                };

                parent[v] = startVertex;
                yield* this._traverse(g, v, visited, parent, traverseOrder);
            }

            yield { codeLine: 6, log: `v = ${v + 1}` };
        }
    }
}