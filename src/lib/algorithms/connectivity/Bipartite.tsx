import { Form, InputNumber, Select } from 'antd';
import { ReactNode } from 'react';
import { AlgorithmStep, NeutralGraphAlgorithm } from '../GraphAlgorithm';
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

interface BipartiteResult
{
    isBipartite: boolean;
    blueVertices: number[];
    redVertices: number[];
}

enum Color
{
    Blue = -1,
    White = 0,
    Red = 1
}

export default class Bipartite extends NeutralGraphAlgorithm<BipartiteConfig, BipartiteResult>
{
    protected override _initResult(): BipartiteResult 
    {
        return {
            isBipartite: true,
            blueVertices: [],
            redVertices: []
        };
    }

    protected override _result(result: BipartiteResult): ReactNode
    {
        return (
            <>
                <p>Đồ thị phân đôi: {result.isBipartite ? 'Có' : 'Không'}</p>
                {result.isBipartite && (
                    <>
                        <p>Đỉnh màu <span className='text-[blue]'>xanh</span>: {result.blueVertices.join(', ')}</p>
                        <p>Đỉnh màu <span className='text-[red]'>đỏ</span>: {result.redVertices.join(', ')}</p>
                    </>
                )}
            </>
        );
    }

    public override defaultConfig(): BipartiteConfig 
    {
        return {
            startVertex: 1,
            startColor: Color.Blue
        };
    }

    public override get code(): string
    {
        return `#define NO_COLOR 0
#define BLUE 1
#define RED -1

int color[MAX_N];
int conflict;

void colorize(Graph* G, int u, int clr) {
    color[u] = clr;

    for (int v = 1; v <= n; v++) {
        if (adjacent(G, u, v)) {
            if (color[v] == NO_COLOR) {
                colorize(G, v, -clr);
                if (conflict)
                    return;
            }
            else if (color[v] == color[u]) {
                conflict = 1;
                return;
            }
        }
    }
}`;
    }

    public get name(): string
    {
        return 'Kiểm tra đồ thị phân đôi';
    }

    private _getColorName(color: Color): string
    {
        switch (color)
        {
            case Color.Blue: return 'BLUE';
            case Color.Red: return 'RED';
            case Color.White: return 'NO_COLOR';
        }
    }

    private *_colorize(g: UnweightedGraph, u: number, color: Color, ctx: BipartiteContext): IterableIterator<AlgorithmStep>
    {
        yield { codeLine: 8, log: `colorize(G, ${u}, ${this._getColorName(color)}` };
        ctx.color[u] = color;
        yield { codeLine: 9, log: `color[${u}] = ${this._getColorName(color)}`, colorVertex: [u, color === Color.Blue ? 'blue' : 'red'] };

        yield { codeLine: 11, log: `v = 1` };
        for (let v = 1; v <= g.vertexCount; v++)
        {
            yield { codeLine: 12, log: `G->A[${u}][${v}] = ${g.matrix[u][v]}` };
            if (g.adjacent(u, v))
            {
                yield { codeLine: 13, log: `color[${v}] = ${this._getColorName(ctx.color[v])}` };
                if (ctx.color[v] === Color.White)
                {
                    yield { codeLine: 14, log: `Gọi đệ quy colorize(G, ${v}, ${this._getColorName(-color)})` };
                    yield* this._colorize(g, v, -color, ctx);
                    yield { codeLine: 15, log: `conflict = ${ctx.isBipartite}` };
                    if (!ctx.isBipartite)
                    {
                        yield { codeLine: 16, log: 'Thoát đệ quy', colorVertex: [v, 'red'], colorEdge: [u, v, 'red'] };
                        return;
                    }

                    continue;
                }

                yield { codeLine: 18, log: `color[${v}] = ${this._getColorName(ctx.color[v])}, color[${u}] = ${this._getColorName(ctx.color[u])}` };
                if (ctx.color[v] === ctx.color[u])
                {
                    yield { codeLine: 19, log: 'conflict = true', colorVertex: [v, 'red'], colorEdge: [u, v, 'red'] };
                    ctx.isBipartite = false;
                    
                    yield { codeLine: 20, log: 'Thoát đệ quy' };
                    return;
                }
            }

            yield { codeLine: 11, log: `v = ${v + 1}` };
        }
    }

    protected override *_run(g: UnweightedGraph, config: BipartiteConfig, result: BipartiteResult): IterableIterator<AlgorithmStep>
    {
        const ctx = new BipartiteContext(g);
        yield { codeLine: 5, log: `color = {${Array(g.vertexCount + 1).fill("NO_COLOR").join(", ")}}` };
        yield { codeLine: 6, log: `conflict = false` };

        yield* this._colorize(g, config.startVertex, config.startColor, ctx);

        result.isBipartite = ctx.isBipartite;
        result.blueVertices = ctx.color.map((c, i) => c === Color.Blue ? i : -1).filter(v => v !== -1);
        result.redVertices = ctx.color.map((c, i) => c === Color.Red ? i : -1).filter(v => v !== -1);
    }

    public override configNode(): ReactNode
    {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<BipartiteConfig> label="Đỉnh bắt đầu" name="startVertex">
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
                <Form.Item<BipartiteConfig> label="Màu đỉnh đầu tiên" name="startColor">
                    <Select options={[{ value: Color.Blue, label: <p className='text-[blue]'>Xanh</p> }, { value: Color.Red, label: <p className='text-[red]'>Đỏ</p> }]} />
                </Form.Item>
            </>
        )
    }
}