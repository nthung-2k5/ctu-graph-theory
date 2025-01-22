import { ReactNode } from 'react';
import { GraphAlgorithm } from '../GraphAlgorithm';
import { Form, InputNumber } from 'antd';
import Graph from '../../graphs/Graph';

export interface TraversalConfig
{
    startVertex: number;
}

export default abstract class TraversalAlgorithm extends GraphAlgorithm<TraversalConfig>
{
    public predicateCheck(): { valid: boolean; errors?: string[]; }
    {
        return { valid: true };
    }

    public override configNode(graph: Graph): ReactNode
    {
        return (
            <>
                <Form.Item<TraversalConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={graph.vertexCount} />
                </Form.Item>
            </>
        )
    }
}