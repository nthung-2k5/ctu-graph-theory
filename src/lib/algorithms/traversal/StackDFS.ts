import { Stack } from 'data-structure-typed';
import UnweightedGraph from '../../graphs/unweighted/UnweightedGraph';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm, { TraversalConfig } from './TraversalAlgorithm';

export default class StackDFS extends TraversalAlgorithm
{
    public get name()
    {
        return 'Duyệt theo chiều sâu (DFS) bằng ngăn xếp';
    }

    *run(g: UnweightedGraph, config: TraversalConfig): IterableIterator<AlgorithmStep>
    {
        const visited: boolean[] = Array(g.vertexCount + 1).fill(false);

        const stack = new Stack<number>();
        stack.push(config.startVertex);
        visited[config.startVertex] = true;

        while (!stack.isEmpty())
        {
            const u = stack.pop()!;
            yield { animate: animator => animator.colorVertex(u, 'red') };

            const neighbors = g.neighbors(u);

            for (const v of neighbors)
            {
                if (!visited[v])
                {
                    stack.push(v);
                    yield { animate: animator => animator.colorVertex(v, 'blue') };
                    visited[v] = true;
                }
            }
        }
    }
}