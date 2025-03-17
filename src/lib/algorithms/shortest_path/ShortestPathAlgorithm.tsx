import { ReactNode } from 'react';
import { WeightedGraphAlgorithm } from '../GraphAlgorithm';
import store from '../../context/store';
import { Form, InputNumber } from 'antd';

export interface ShortestPathConfig
{
    startVertex: number;
}

export interface ShortestPathResult
{
    startVertex: number;
    distance: number[];
}

export abstract class ShortestPathAlgorithm extends WeightedGraphAlgorithm<ShortestPathConfig, ShortestPathResult>
{
    protected override _initResult(): ShortestPathResult
    {
        const n = store.getState().graph.vertexCount;
        return {
            startVertex: 1,
            distance: Array(n).fill(Infinity),
        };
    }

    protected override _result(result: ShortestPathResult): ReactNode 
    {
        return (
            <div>
                <p>Độ dài đường đi từ đỉnh {result.startVertex} đến:</p>
                <ul>
                    {result.distance.slice(1).map((dist, index) => (
                        <li key={index}>
                            Đỉnh {index + 1}: {dist === Infinity ? "∞" : dist}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    public override defaultConfig(): ShortestPathConfig 
    {
        return {
            startVertex: 1,
        };
    }

    public override configNode(): ReactNode 
    {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<ShortestPathConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
            </>
        );
    }
}