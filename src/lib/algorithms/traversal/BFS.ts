import { Queue } from 'data-structure-typed';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';
import { UnweightedGraph } from '../UnweightedGraph';
import { SequenceType } from '../../../tabs/Debugger';

export default class BFS extends TraversalAlgorithm
{
    public override get code(): string
    {
        return `int mark[MAX_N];

void BFS(Graph* G, int s) {
    Queue Q; makeNullQueue(&Q);

    enqueue(Q, s);

    while (!empty(Q)) {
        int u = front(Q); dequeue(&Q);
        if (mark[u])
            continue;

        mark[u] = 1;

        for (int v = 1; v <= n; v++)
            if (adjacent(G, u, v))
                enqueue(Q, v);
    }
}`;
    }

    public get name()
    {
        return 'Duyệt theo chiều rộng (BFS)';
    }

    *_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[]): IterableIterator<AlgorithmStep>
    {
        yield { codeLine: 3, pushStackTrace: `BFS(G, ${startVertex})` };
        const queue: Queue<number> = new Queue<number>();
        yield { codeLine: 4, addVariable: ['Q', { type: SequenceType.Queue, value: [] }, 'local'] };
        
        queue.push(startVertex);
        yield { 
            codeLine: 6,
            highlightVertex: [startVertex, true],
            colorVertex: [startVertex, 'orange'],
            updateVariable: ['Q', queue.toArray(), 'local']
        };
        
        yield { codeLine: 8 };
        while (!queue.isEmpty())
        {
            const u = queue.shift()!;

            yield { 
                codeLine: 9,
                highlightVertex: [u, true],
                colorVertex: [u, 'yellow'],
                addVariable: ['u', u, 'local'],
                updateVariable: ['Q', queue.toArray(), 'local']    
            };

            yield { codeLine: 10 };
            if (visited[u])
            {
                yield { codeLine: 11 };
                continue;
            }

            visited[u] = true;
            yield {
                colorVertex: [u, 'red'],
                colorEdge: parent[u] !== -1 ? [parent[u], u, 'red'] : undefined,
                codeLine: 13,
                updateVariable: ['visited', visited, 'local']
            };

            yield {
                codeLine: 15,
                addVariable: ['v', 1, 'local']
            };
            for (let v = 1; v <= g.vertexCount; v++)
            {
                yield {
                    codeLine: 16, 
                    highlightVertex: [v, true],
                    highlightEdge: [u, v, true] 
                };

                if (g.matrix[u][v] && !visited[v])
                {
                    queue.push(v);

                    let colorEdge = {};

                    if (parent[v] === -1)
                    {
                        parent[v] = u;
                        colorEdge = {
                            colorEdge: [u, v, 'blue'],
                        };
                    }

                    yield { 
                        codeLine: 17,
                        colorVertex: [v, 'orange'],
                        updateVariable: ['Q', queue.toArray(), 'local'],
                        ...colorEdge
                    };
                }
                yield { codeLine: 15, highlightVertex: u !== v ? [v, false]: undefined, highlightEdge: [u, v, false], updateVariable: ['v', v + 1, 'local'] };
            }

            yield { 
                codeLine: 18, 
                highlightVertex: [u, false],
                colorVertex: [u, 'purple'],
                removeVariable: [['v', 'local']]
            };

            yield { codeLine: 8, removeVariable: ['u', 'local'] };
        }

        yield { codeLine: 19, popStackTrace: true };
    }
}