import { Queue } from 'data-structure-typed';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';
import { UnweightedGraph } from '../UnweightedGraph';

export default class BFS extends TraversalAlgorithm
{
    public override get code(): string
    {
        return `int mark[MAX_N];

void BFS(Graph* G, int s) {
    Queue Q; makeNullQueue(&Q);

    enqueue(&Q, s);
    mark[s] = 1;

    while (!empty(Q)) {
        int u = front(Q); dequeue(&Q);

        for (int v = 1; v <= n; v++) {
            if (adjacent(G, u, v)) {
                if (!mark[v]) {
                    mark[v] = 1;
                    enqueue(&Q, v);
                }
            }
        }
    }
}`;
    }

    public get name()
    {
        return 'Duyệt theo chiều rộng (BFS)';
    }

    *_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[], traverseOrder: number[]): IterableIterator<AlgorithmStep>
    {
        yield {
            codeLine: 3,
            log: `BFS(G, ${startVertex})`
        };

        const queue: Queue<number> = new Queue<number>();
        yield {
            codeLine: 4,
            log: `Q = {}`
        };
        
        queue.push(startVertex);
        yield { 
            codeLine: 6,
            borderColorVertex: [startVertex, 'red'],
            log: `Q = {${startVertex}}`
        };

        yield {
            codeLine: 7,
            log: `mark[${startVertex}] = 1`,
            backgroundColorVertex: [startVertex, 'deepskyblue'],
            contentColorVertex: [startVertex, 'white']
        };
        
        while (1)
        {
            yield { codeLine: 9, log: `Q = {${queue.toArray().join(', ')}} => !empty(Q) = ${!queue.isEmpty()}` };

            if (queue.isEmpty()) break;
            const u = queue.shift()!;

            yield { 
                codeLine: 10,
                highlightVertex: [u, true],
                borderColorVertex: [u, 'default'],
                log: `u = ${u}, Q = {${queue.toArray().join(', ')}}`
            };

            traverseOrder.push(u);

            for (const v of g.neighbors(u))
            {
                yield {
                    codeLine: [12, 13], 
                    highlightVertex: [v, true],
                    highlightEdge: [u, v, true],
                    log: `Xét đỉnh ${v}`
                };

                yield {
                    codeLine: 14,
                    log: `!(mark[${v}] = ${visited[v] ? 1 : 0}) => ${!visited[v]}`
                }
                if (!visited[v])
                {
                    visited[v] = true;

                    yield {
                        codeLine: 15,
                        log: `mark[${v}] = 1`,
                        backgroundColorVertex: [v, 'deepskyblue'],
                        contentColorVertex: [v, 'white']
                    };

                    queue.push(v);

                    yield { 
                        codeLine: 17,
                        borderColorVertex: [v, 'red'],
                        colorEdge: [u, v, 'deepskyblue'],
                        log: `Q = {${queue.toArray().join(', ')}}`
                    };

                    parent[v] = u;
                    yield {
                        codeLine: 18,
                        log: `parent[${v}] = ${u}`
                    }
                }

                yield {
                    codeLine: 19,
                    log: `Kết thúc xét đỉnh ${v}`,
                    highlightVertex: [v, false],
                    highlightEdge: [u, v, false],
                };
            }

            yield {
                codeLine: 20,
                log: `Kết thúc duyệt đỉnh ${u}`,
                highlightVertex: [u, false]
            }
        }

        yield { codeLine: 21, log: 'Kết thúc thuật toán' };
    }
}