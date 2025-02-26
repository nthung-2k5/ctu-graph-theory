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
    protected abstract _traverse(g: UnweightedGraph, startVertex: number, visited: boolean[]): IterableIterator<AlgorithmStep>;

    protected *_run(g: UnweightedGraph, config: TraversalConfig): IterableIterator<AlgorithmStep>
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

    public override configNode(): ReactNode
    {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                {/* <div className="flex items-center space-x-4 gap-8">
                    <Form.Item<TraversalConfig>
                        style={{ marginBottom: '5px'}}
                        name="startVertex"
                        initialValue={1}
                        label="Đỉnh bắt đầu"
                    >
                        <InputNumber min={1} max={vertexCount} />
                    </Form.Item>
                    <Form.Item<TraversalConfig> 
                        name="traverseAll"
                        valuePropName="checked"
                        style={{ marginBottom: '5px' }}
                    >
                        <Checkbox>Duyệt tất cả các đỉnh</Checkbox>
                    </Form.Item>
                </div> */}
                <Form.Item<TraversalConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
                <Form.Item<TraversalConfig> name="traverseAll" valuePropName="checked">
                    <Checkbox>Duyệt tất cả các đỉnh</Checkbox>
                </Form.Item>
            </>
        )
    }
}