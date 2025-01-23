import Graph from '../../graphs/Graph';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';

export default class RecursionDFS extends TraversalAlgorithm
{
    public get name()
    {
        return 'Duyệt theo chiều sâu (DFS) bằng đệ quy';
    }

    *_traverse(g: Graph, startVertex: number, visited: boolean[]): IterableIterator<AlgorithmStep>
    {
        visited[startVertex] = true;
        yield { animate: animator => animator.colorVertex(startVertex, 'red') };

        const neighbors = g.neighbors(startVertex);

        for (const v of neighbors)
        {
            if (!visited[v])
            {
                yield { animate: animator => animator.colorVertex(v, 'blue').colorEdge(startVertex, v, 'red', g.directed) };
                yield* this._traverse(g, v, visited);
            }
        }
    }
}