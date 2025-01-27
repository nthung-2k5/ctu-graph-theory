import { ReactNode } from 'react';
import { AlgorithmStep, GraphAlgorithm, MustBeUndirectedError } from './GraphAlgorithm';
import { Form, InputNumber } from 'antd';
import Graph from '../graphs/Graph';

export interface UndirectedConnectedConfig
{
    startVertex: number;
}

export default class UndirectedConnected extends GraphAlgorithm<UndirectedConnectedConfig>
{
    public get name(): string
    {
        return 'Kiểm tra đồ thị vô hướng liên thông';
    }

    public predicateCheck(g: Graph): { valid: boolean; errors?: string[]; }
    {
        return { valid: !g.directed, errors: [MustBeUndirectedError] };
    }

    private *_dfs(g: Graph, u: number, visited: boolean[]): IterableIterator<AlgorithmStep>
    {
        visited[u] = true;
        yield { animate: (animator) => animator.colorVertex(u, 'green') };

        for (const v of g.neighbors(u))
        {
            if (!visited[v])
            {
                yield { animate: (animator) => animator.colorEdge(u, v, 'green', false) };
                yield* this._dfs(g, v, visited);
            }
        }
    }

    public *run(g: Graph, config: UndirectedConnectedConfig): IterableIterator<AlgorithmStep>
    {
        const visited: boolean[] = Array(g.vertexCount + 1).fill(false);
        yield* this._dfs(g, config.startVertex, visited);

        for (let u = 1; u <= g.vertexCount; u++)
        {
            if (!visited[u])
            {
                yield { animate: (animator) => animator.colorVertex(u, 'red') };
            }
        }
    }

    public override configNode(graph: Graph): ReactNode
    {
        return (
            <>
                <Form.Item<UndirectedConnectedConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={graph.vertexCount} />
                </Form.Item>
            </>
        )
    }
}