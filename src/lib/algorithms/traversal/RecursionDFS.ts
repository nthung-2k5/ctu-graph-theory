import UnweightedGraph from '../../graphs/unweighted/UnweightedGraph';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm, { TraversalConfig } from './TraversalAlgorithm';

export default class RecursionDFS extends TraversalAlgorithm
{
    public get name()
    {
        return 'Duyệt theo chiều sâu (DFS) bằng đệ quy';
    }

    *run(g: UnweightedGraph, config: TraversalConfig): IterableIterator<AlgorithmStep>
    {
        const visited: boolean[] = Array(g.vertexCount + 1).fill(false);

        function *dfs(u: number): IterableIterator<AlgorithmStep>
        {
            visited[u] = true;
            yield { animate: animator => animator.colorVertex(u, 'red') };

            const neighbors = g.neighbors(u);

            for (const v of neighbors)
            {
                if (!visited[v])
                {
                    yield { animate: animator => animator.colorVertex(v, 'blue') };
                    yield* dfs(v);
                }
            }
        }

        yield* dfs(config.startVertex);

        for (let u = 1; u <= g.vertexCount; u++)
        {
            if (!visited[u])
            {
                yield* dfs(u);
            }
        }
    }
}