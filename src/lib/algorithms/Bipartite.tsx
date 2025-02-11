import { Form, InputNumber, Select } from 'antd';
import { ReactNode } from 'react';
import Graph from '../graphs/Graph';
import { GraphAlgorithm, AlgorithmStep } from './GraphAlgorithm';

export interface BipartiteConfig
{
    startVertex: number;
    startColor: Color;
}

class BipartiteContext
{
    public color: Color[];

    public isBipartite: boolean = true;

    constructor(graph: Graph)
    {
        this.color = Array(graph.vertexCount + 1).fill(Color.White);
    }
}

enum Color
{
    Blue = -1,
    White = 0,
    Red = 1
}

export default class Bipartite extends GraphAlgorithm<BipartiteConfig>
{
    public get name(): string
    {
        return 'Kiểm tra đồ thị phân đôi';
    }

    public predicateCheck(): { valid: boolean; error?: string; }
    {
        return { valid: true };
    }

    private *_colorize(g: Graph, u: number, color: Color, ctx: BipartiteContext): IterableIterator<AlgorithmStep>
    {
        ctx.color[u] = color;
        yield { animate: (animator) => animator.colorVertex(u, color === Color.Blue ? 'blue' : 'red') };

        for (const v of g.neighbors(u))
        {
            if (ctx.color[v] === Color.White)
            {
                yield { animate: (animator) => animator.colorEdge(u, v, "black", g.directed) };
                yield* this._colorize(g, v, -color, ctx);
                if (!ctx.isBipartite)
                {
                    yield { animate: (animator) => animator.colorVertex(v, 'red').colorEdge(u, v, 'red', g.directed) };
                    return;
                }
            }
            else if (ctx.color[v] === ctx.color[u])
            {
                ctx.isBipartite = false;
                yield { animate: (animator) => animator.colorVertex(v, 'red').colorEdge(u, v, 'red', g.directed) };
                return;
            }
        }
    }

    public *run(g: Graph, config: BipartiteConfig): IterableIterator<AlgorithmStep>
    {
        const ctx = new BipartiteContext(g);
        yield* this._colorize(g, config.startVertex, config.startColor, ctx);
    }

    public override configNode(graph: Graph): ReactNode
    {
        return (
            <>
                <Form.Item<BipartiteConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={graph.vertexCount} />
                </Form.Item>
                <Form.Item<BipartiteConfig> label="Màu đỉnh đầu tiên" name="startColor" initialValue={Color.Blue}>
                    <Select options={[{ value: Color.Blue, label: <p className='text-[blue]'>Xanh</p> }, { value: Color.Red, label: <p className='text-[red]'>Đỏ</p> }]} />
                </Form.Item>
            </>
        )
    }
}