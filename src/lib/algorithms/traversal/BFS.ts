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

    *_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[]): IterableIterator<AlgorithmStep>
    {
        const queue: Queue<number> = new Queue<number>();

        queue.push(startVertex);
        visited[startVertex] = true;
        
        while (!queue.isEmpty())
        {
            const u = queue.shift()!;
            yield { animate: animator => animator.colorVertex(u, 'red') };

            const neighbors = g.neighbors(u);

            for (const v of neighbors)
            {
                if (!visited[v])
                {
                    queue.push(v);
                    yield { animate: animator => animator.colorVertex(v, 'blue').colorEdge(u, v, 'red', g.directed) };
                    visited[v] = true;
                }
            }
        }
    }
}