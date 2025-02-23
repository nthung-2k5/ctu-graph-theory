import { Queue } from 'data-structure-typed';
import { AlgorithmStep } from '../GraphAlgorithm';
import Graph from '../../graphs/Graph';
import TraversalAlgorithm from './TraversalAlgorithm';
import { PseudocodeLine } from '../../pseudocode/Pseudocode';

export default class BFS extends TraversalAlgorithm
{
    public override get pseudocode(): PseudocodeLine[] 
    {
        return [
            { text: 'while (hàng đợi không rỗng)', tab: 0 },
            { text: 'u = lấy đầu hàng đợi', tab: 1 },
            { text: 'if (u đã duyệt)', tab: 1 },
            { text: 'continue', tab: 2 },
            { text: 'Duyệt u', tab: 1 },
            { text: 'Đánh dấu u đã duyệt', tab: 1 },
            { text: 'for (đỉnh v kề với u)', tab: 1 },
            { text: 'if (v chưa duyệt)', tab: 2 },
            { text: 'đẩy v vào hàng đợi', tab: 3 },
        ]
    }

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