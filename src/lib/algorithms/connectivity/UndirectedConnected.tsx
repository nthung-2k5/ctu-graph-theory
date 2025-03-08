import { ReactNode } from 'react';
import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from '../GraphAlgorithm';
import { Form, InputNumber } from 'antd';
import { PseudocodeLine } from '../../pseudocode/Pseudocode';
import { UnweightedGraph } from '../UnweightedGraph';
import store from '../../context/store';

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

    private *_dfs(g: UnweightedGraph, u: number, visited: boolean[]): IterableIterator<AlgorithmStep>
    {
        visited[u] = true;
        yield { colorVertex: [u, 'green'] };

        for (const v of g.neighbors(u))
        {
            if (!visited[v])
            {
                yield { colorEdge: [u, v, 'green'] };
                yield* this._dfs(g, v, visited);
            }
        }
    }

    protected *_run(g: UnweightedGraph, config: UndirectedConnectedConfig): IterableIterator<AlgorithmStep>
    {
        const visited: boolean[] = Array(g.vertexCount + 1).fill(false);
        yield* this._dfs(g, config.startVertex, visited);

        for (let u = 1; u <= g.vertexCount; u++)
        {
            if (!visited[u])
            {
                yield { colorVertex: [u, 'red'] };
            }
        }
    }

    public override configNode(): ReactNode
    {
        const vertexCount = store.getState().graph.vertexCount;
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