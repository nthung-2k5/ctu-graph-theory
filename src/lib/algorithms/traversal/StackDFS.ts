import { Stack } from 'data-structure-typed';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';
import { PseudocodeLine } from '../../pseudocode/Pseudocode';
import { UnweightedGraph } from '../UnweightedGraph';

export default class StackDFS extends TraversalAlgorithm
{
    public override get pseudocode(): PseudocodeLine[] 
    {
        return [
            { text: 'while (ngăn xếp không rỗng)', tab: 0 },
            { text: 'u = lấy đỉnh ngăn xếp', tab: 1 },
            { text: 'if (u đã duyệt)', tab: 1 },
            { text: 'continue', tab: 2 },
            { text: 'Duyệt u', tab: 1 },
            { text: 'Đánh dấu u đã duyệt', tab: 1 },
            { text: 'for (đỉnh v kề với u)', tab: 1 },
            { text: 'if (v chưa duyệt)', tab: 2 },
            { text: 'đẩy v vào ngăn xếp', tab: 3 },
        ];
    }

    public get name()
    {
        return 'Duyệt theo chiều sâu (DFS) bằng ngăn xếp';
    }

    *_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[]): IterableIterator<AlgorithmStep>
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