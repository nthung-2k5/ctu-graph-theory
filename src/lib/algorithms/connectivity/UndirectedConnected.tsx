import { ReactNode } from 'react';
import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from '../GraphAlgorithm';
import { Form, InputNumber } from 'antd';
import Graph from '../../graphs/Graph';
import { PseudocodeLine } from '../../pseudocode/Pseudocode';

export interface UndirectedConnectedConfig
{
    startVertex: number;
}

export default class UndirectedConnected extends NeutralGraphAlgorithm<UndirectedConnectedConfig>
{
    public override get pseudocode(): PseudocodeLine[] 
    {
        return [

        ];
    }

    public get name(): string
    {
        return 'Kiểm tra đồ thị vô hướng liên thông';
    }

    public override get predicate(): AlgorithmRequirements 
    {
        return { ...super.predicate, directed: false };
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

    public override configNode(vertexCount: number): ReactNode
    {
        return (
            <Form.Item<UndirectedConnectedConfig> 
                label="Đỉnh bắt đầu"
                name="startVertex"
                initialValue={1}
            >   
                <InputNumber min={1} max={vertexCount} />
            </Form.Item>
        )
    }
}