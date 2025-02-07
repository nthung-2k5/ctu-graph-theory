import Graph from '../../graphs/Graph';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';

export const stackDfsPseudoCode = [
    {
        text: 'DFS(u)',
        cmt: (vertex: number) => [`DFS(${vertex})`],
        tab: 0
    },
    {
        text: 'Tiến hành thăm đỉnh u',
        cmt: (vertex: number, visited: Array<number>) => {
            return [
                `Đánh dấu đỉnh ${vertex} đã được thăm`,
                `visited[${visited.join(', ')}] = true`
            ]
        },
        tab: 0
    },
    {
        text: 'Xử lý đỉnh u (ví dụ: in ra u)',
        cmt: (order: Array<number>) => {
            return `Thứ tự duyệt: ${[...order].join(' -> ')}`;
        },
        tab: 0
    },
    {
        text: 'Với mỗi đỉnh kề v của u:',
        cmt: (vertex: number, neighbours: Array<number>) => {
            return [
                `Các đỉnh kề của ${vertex}`,
                `neighbours = [${neighbours.join(', ')}]`
            ]
        },
        tab: 0
    },
    {
        text: 'Nếu v chưa thăm, gọi DFS()',
        cmt: (vertex: number, mark: boolean ) => {
            return (
                mark ? `Đỉnh ${vertex} chưa được thăm -> Đi thăm` 
                : `Đỉnh ${vertex} đã được thăm -> Bỏ qua`
            );
        },
        tab: 1   
    }
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