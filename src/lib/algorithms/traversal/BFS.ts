import { Queue } from 'data-structure-typed';
import { AlgorithmStep } from '../GraphAlgorithm';
import Graph from '../../graphs/Graph';
import TraversalAlgorithm from './TraversalAlgorithm';

export default class BFS extends TraversalAlgorithm
{
    public getInfo = {order: -1};
    
    public get name()
    {
        return 'Duyệt theo chiều rộng (BFS)';
    }

    *_traverse(g: Graph, startVertex: number, visited: boolean[]): IterableIterator<AlgorithmStep>
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