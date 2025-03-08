import { ReactNode } from 'react';
import { AlgorithmStep, NeutralGraphAlgorithm } from '../GraphAlgorithm';
import { Checkbox, Form, InputNumber } from 'antd';
import { UnweightedGraph } from '../UnweightedGraph';
import store from '../../context/store';

export interface TraversalConfig
{
    startVertex: number;
    traverseAll: boolean;
}

export default abstract class TraversalAlgorithm extends NeutralGraphAlgorithm<TraversalConfig>
{
    protected abstract _traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[]): IterableIterator<AlgorithmStep>;

    public override defaultConfig(): TraversalConfig
    {
        return {
            startVertex: 1,
            traverseAll: false,
        };
    }

    protected *_run(g: UnweightedGraph, config: TraversalConfig): IterableIterator<AlgorithmStep>
    {
        const visited: boolean[] = Array(g.vertexCount + 1).fill(false);
        const parent: number[] = Array(g.vertexCount + 1).fill(-1);

        yield { codeLine: 1, log: `mark[${g.vertexCount + 1}] = {${visited.join(', ')}}` };

        yield* this._traverse(g, config.startVertex, visited, parent);

        if (config.traverseAll)
        {
            for (let u = 1; u <= g.vertexCount; u++)
            {
                if (!visited[u])
                {
                    yield* this._traverse(g, u, visited, parent);
                }
            }
        }
    }

    public override configNode(): ReactNode
    {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<TraversalConfig> label="Đỉnh bắt đầu" name="startVertex">
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
                <Form.Item<TraversalConfig> name="traverseAll" valuePropName="checked">
                    <Checkbox>Duyệt tất cả các đỉnh</Checkbox>
                </Form.Item>
            </>
        )
    }
}