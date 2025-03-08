import { Form, InputNumber, Select } from 'antd';
import { ReactNode } from 'react';
import { AlgorithmStep, NeutralGraphAlgorithm } from '../GraphAlgorithm';
import { PseudocodeLine } from '../../pseudocode/Pseudocode';
import { UnweightedGraph } from '../UnweightedGraph';
import store from '../../context/store';

export interface BipartiteConfig
{
    startVertex: number;
    startColor: Color;
}

class BipartiteContext
{
    public color: Color[];

    public isBipartite: boolean = true;

    constructor(graph: UnweightedGraph)
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

export default class Bipartite extends NeutralGraphAlgorithm<BipartiteConfig>
{
    public override get pseudocode(): PseudocodeLine[] 
    {
        return [

        ];
    }

    public get name(): string
    {
        return 'Kiểm tra đồ thị phân đôi';
    }

    private *_colorize(g: UnweightedGraph, u: number, color: Color, ctx: BipartiteContext): IterableIterator<AlgorithmStep>
    {
        ctx.color[u] = color;
        yield { colorVertex: [u, color === Color.Blue ? 'blue' : 'red'] };

        for (const v of g.neighbors(u))
        {
            if (ctx.color[v] === Color.White)
            {
                yield { colorEdge: [u, v, "black"] };
                yield* this._colorize(g, v, -color, ctx);
                if (!ctx.isBipartite)
                {
                    yield { colorVertex: [v, 'red'], colorEdge: [u, v, 'red'] };
                    return;
                }
            }
            else if (ctx.color[v] === ctx.color[u])
            {
                ctx.isBipartite = false;
                yield { colorVertex: [v, 'red'], colorEdge: [u, v, 'red'] };
                return;
            }
        }
    }

    protected override *_run(g: UnweightedGraph, config: BipartiteConfig): IterableIterator<AlgorithmStep>
    {
        const ctx = new BipartiteContext(g);
        yield* this._colorize(g, config.startVertex, config.startColor, ctx);
    }

    public override configNode(): ReactNode
    {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<BipartiteConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
                <Form.Item<BipartiteConfig> label="Màu đỉnh đầu tiên" name="startColor" initialValue={Color.Blue}>
                    <Select options={[{ value: Color.Blue, label: <p className='text-[blue]'>Xanh</p> }, { value: Color.Red, label: <p className='text-[red]'>Đỏ</p> }]} />
                </Form.Item>
            </>
        )
    }
}