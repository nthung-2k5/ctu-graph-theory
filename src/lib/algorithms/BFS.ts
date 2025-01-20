import { Queue } from 'data-structure-typed';
import UnweightedGraph from '../UnweightedGraph';
import { AlgorithmStep, ConfigGraphAlgorithm } from './GraphAlgorithm';
import { ReactNode } from 'react';

export interface BFSConfig
{
    startVertex: number;
}

export default class BFS extends ConfigGraphAlgorithm<BFSConfig>
{
    public get name()
    {
        return 'Duyệt theo chiều rộng (BFS)';
    }

    public get configNode(): ReactNode {
        throw new Error('Method not implemented.');
    }

    predicateCheck(): { valid: boolean, errors?: string[] }
    {
        return { valid: true };
    }

    *run(g: UnweightedGraph, config: BFSConfig): IterableIterator<AlgorithmStep>
    {
        const queue: Queue<number> = new Queue<number>();
        const visited: boolean[] = Array(g.vertexCount).fill(false);

        queue.push(config.startVertex);
        visited[config.startVertex] = true;

        while (queue.length > 0)
        {
            yield { description: `Hàng đợi hiện tại: {${queue.toArray().join(', ')}}` };
            
            const u = queue.shift()!;
            yield { description: `Duyệt đỉnh ${u}` };

            const neighbors = g.neighbors(u);

            for (const v of neighbors)
            {
                if (!visited[v])
                {
                    yield { description: `Đỉnh ${v} chưa được duyệt. Thêm đỉnh ${v} vào hàng đợi` };
                    queue.push(v);
                    visited[v] = true;
                }
            }
        }
    }
}