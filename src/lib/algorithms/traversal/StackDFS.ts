import { Stack } from 'data-structure-typed';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';
import Graph from '../../graphs/Graph';

export const stackDfsPseudoCode = [
    
];

export default class StackDFS extends TraversalAlgorithm
{
    public get name()
    {
        return 'Duyệt theo chiều sâu (DFS) bằng ngăn xếp';
    }

    *_traverse(g: Graph, startVertex: number, visited: boolean[]): IterableIterator<AlgorithmStep>
    {
        const stack = new Stack<number>();
        stack.push(startVertex);
        visited[startVertex] = true;

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
                    yield { animate: animator => animator.colorVertex(v, 'blue').colorEdge(u, v, 'red', g.directed) };
                    visited[v] = true;
                }
            }
        }
    }
}