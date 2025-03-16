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

    for (int v = 1; v <= n; v++) {
        if (adjacent(G, u, v)) {
            if (!mark[v]) {
                DFS(G, v);
            }
        }
    }
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
            codeLine: 4,
            log: `mark[${startVertex}] = 1`,
            backgroundColorVertex: [startVertex, 'deepskyblue'],
            contentColorVertex: [startVertex, 'white'],
            highlightVertex: [startVertex, true]
        };

        for (const v of g.neighbors(startVertex))
        {
            yield { codeLine: [6, 7], log: `Xét đỉnh ${v}`, highlightVertex: [v, true], highlightEdge: [startVertex, v, true] };

            yield { codeLine: 8, log: `!(mark[${v}] = ${visited[v] ? 1 : 0}) => ${!visited[v]}` };
            if (!visited[v])
            {
                parent[v] = startVertex;
                yield {
                    colorEdge: [startVertex, v, 'deepskyblue'],
                    codeLine: 9,
                    log: `DFS(G, ${v})`
                };

                yield* this._traverse(g, v, visited, parent, traverseOrder);
            }

            yield {
                codeLine: 12,
                log: `Kết thúc xét đỉnh ${v}`,
                highlightVertex: [v, false],
                highlightEdge: [startVertex, v, false],
            };
        }

        yield {
            codeLine: 13,
            log: `Kết thúc duyệt đỉnh ${startVertex}`,
            highlightVertex: [startVertex, false]
        };
    }
}