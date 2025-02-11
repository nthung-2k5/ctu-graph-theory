import { ReactNode } from 'react';
import { AlgorithmStep, GraphAlgorithm } from '../GraphAlgorithm';
import { Checkbox, Form, InputNumber } from 'antd';
import Graph from '../../graphs/Graph';

export interface TraversalConfig
{
    startVertex: number;
    traverseAll: boolean;
}

export default abstract class TraversalAlgorithm extends GraphAlgorithm<TraversalConfig>
{
    public predicateCheck(): { valid: boolean; error?: string; }
    {
        return { valid: true };
    }

    protected abstract _traverse(g: Graph, startVertex: number, visited: boolean[]): IterableIterator<AlgorithmStep>;

    public *run(g: Graph, config: TraversalConfig): IterableIterator<AlgorithmStep>
    {
        const visited: boolean[] = Array(g.vertexCount + 1).fill(false);
        yield* this._traverse(g, config.startVertex, visited);

        if (config.traverseAll)
        {
            for (let u = 1; u <= g.vertexCount; u++)
            {
                if (!visited[u])
                {
                    yield* this._traverse(g, u, visited);
                }
            }
        }
    }

    public override configNode(graph: Graph): ReactNode
    {
        return (
            <>
                <Form.Item<TraversalConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={graph.vertexCount} />
                </Form.Item>
                <Form.Item<TraversalConfig> name="traverseAll" valuePropName="checked">
                    <Checkbox>Duyệt tất cả các đỉnh</Checkbox>
                </Form.Item>
            </>
        )
    }
}