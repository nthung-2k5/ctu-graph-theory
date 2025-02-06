import Graph from '../../graphs/Graph';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';

export const stackDfsPseudoCode = [
    {text: 'DFS(u)', tab: 0},
    {text: 'In đỉnh u', tab: 0},
    {text: 'Đánh dấu u đã được duyệt', tab: 0},
    {text: 'Với mỗi đỉnh kề v của u:', tab: 0},
    {text: 'Nếu v chưa duyệt, gọi DFS(v)', tab: 1}
];

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