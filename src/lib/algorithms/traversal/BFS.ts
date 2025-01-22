import { Queue } from 'data-structure-typed';
import { AlgorithmStep } from '../GraphAlgorithm';
import Graph from '../../graphs/Graph';
import TraversalAlgorithm, { TraversalConfig } from './TraversalAlgorithm';

export default class BFS extends TraversalAlgorithm
{
    public get name()
    {
        return 'Duyệt theo chiều rộng (BFS)';
    }

    *run(g: Graph, config: TraversalConfig): IterableIterator<AlgorithmStep>
    {
        const queue: Queue<number> = new Queue<number>();
        const visited: boolean[] = Array(g.vertexCount + 1).fill(false);

        queue.push(config.startVertex);
        visited[config.startVertex] = true;
        
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
                    yield { animate: animator => animator.colorVertex(v, 'blue') };
                    visited[v] = true;
                }
            }
        }
    }
}