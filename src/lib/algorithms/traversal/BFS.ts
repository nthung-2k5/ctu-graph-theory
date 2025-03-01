import { Queue } from 'data-structure-typed';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';
import { PseudocodeLine } from '../../pseudocode/Pseudocode';
import { UnweightedGraph } from '../UnweightedGraph';

export default class BFS extends TraversalAlgorithm
{
    public override get pseudocode(): PseudocodeLine[] 
    {
        return [
            { text: 'while (queue != ∅)', tab: 0 },
            { text: 'u <- queue;', tab: 1 },
            { text: 'if (duyet[u] == true)', tab: 1 },
            { text: 'continue;', tab: 2 },
            { text: '// Duyệt u;', tab: 1, comment: true },
            { text: 'duyet[u] = true;', tab: 1 },
            { text: 'for (đỉnh v kề với u)', tab: 1 },
            { text: 'if (duyet[v] != true)', tab: 2 },
            { text: 'queue <- v;', tab: 3 },
        ]
    }

    public get name()
    {
        return 'Duyệt theo chiều rộng (BFS)';
    }

    *_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[]): IterableIterator<AlgorithmStep>
    {
        const queue: Queue<number> = new Queue<number>();

        queue.push(startVertex);
        
        yield { codeLine: 0 };
        while (!queue.isEmpty())
        {
            const u = queue.shift()!;
            yield { codeLine: 1, highlightVertex: [u, true] };

            yield { codeLine: 2 };
            if (visited[u])
            {
                yield { codeLine: 3 };
                yield { codeLine: 0 };
                continue;
            }

            yield {
                colorVertex: [u, 'red'],
                colorEdge: parent[u] !== -1 ? [parent[u], u, 'red'] : undefined,
                codeLine: 4
            };

            visited[u] = true;
            yield { codeLine: 5 };

            const neighbors = g.neighbors(u);

            yield { codeLine: 6 };
            for (const v of neighbors)
            {
                yield { codeLine: 7, highlightVertex: [v, true] };
                if (!visited[v])
                {
                    queue.push(v);
                    yield {
                        colorVertex: parent[v] === -1 ? [v, 'blue'] : undefined,
                        colorEdge: parent[v] === -1 ? [u, v, 'blue'] : undefined,
                        codeLine: 8
                    };

                    if (parent[v] === -1)
                    {
                        parent[v] = u;
                    }
                }
                yield { codeLine: 6, highlightVertex: [v, false] };
            }

            yield { codeLine: 0, highlightVertex: [u, false] };
        }
    }
}