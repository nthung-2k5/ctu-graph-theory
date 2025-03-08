import { ReactNode } from 'react';
import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from '../GraphAlgorithm';
import { Checkbox, Form, InputNumber } from 'antd';
import { PseudocodeLine } from '../../pseudocode/Pseudocode';
import { UnweightedGraph } from '../UnweightedGraph';
import store from '../../context/store';
import { Stack } from 'data-structure-typed';

export interface TarjanConfig
{
    startVertex: number;
    traverseAll: boolean;
}

class TarjanContext
{
    public index: number[];

    public minIndex: number[];

    public sccStack = new Stack<number>();

    public onStack: boolean[];

    public sccCount = 1;

    constructor(graph: UnweightedGraph)
    {
        const n = graph.vertexCount;
        this.index = Array(n + 1).fill(0);
        this.minIndex = Array(n + 1).fill(0);
        this.onStack = Array(n + 1).fill(false);
    }
}

export default class TarjanAlgorithm extends NeutralGraphAlgorithm<TarjanConfig>
{
    public override get pseudocode(): PseudocodeLine[] 
    {
        return [
            { source: 'for each vertex v', target: 'index[v] = 0' },
            { source: 'for each vertex v', target: 'if index[v] = 0', extra: 'then SCC(v)' },
            { source: 'procedure SCC(v)', target: 'index[v] = minIndex[v] = sccCount++' },
            { source: 'push v to sccStack', target: 'onStack[v] = true' },
            { source: 'for each vertex u adjacent to v', target: 'if index[u] = 0', extra: 'then SCC(u)' },
            { source: 'if minIndex[u] = index[u]', target: 'repeat' },
            { source: 'pop w from sccStack', target: 'onStack[w] = false' },
            { source: 'until w = u' },
        ];
    }

    public override get predicate(): AlgorithmRequirements
    {
        return { directed: true };
    }

    public get name(): string
    {
        return 'Tìm các bộ phận liên thông mạnh (Thuật toán Tarjan)';
    }

    private *_scc(g: UnweightedGraph, u: number, ctx: TarjanContext): IterableIterator<AlgorithmStep>
    {
        ctx.index[u] = ctx.minIndex[u] = ctx.sccCount++;
        ctx.sccStack.push(u);
        ctx.onStack[u] = true;

        yield { colorVertex: [u, 'gray'] };

        for (const v of g.neighbors(u))
        {
            if (ctx.index[v] === 0)
            {
                yield* this._scc(g, v, ctx);
                ctx.minIndex[u] = Math.min(ctx.minIndex[u], ctx.minIndex[v]);
            }
            else if (ctx.onStack[v])
            {
                ctx.minIndex[u] = Math.min(ctx.minIndex[u], ctx.index[v]);
            }
        }

        if (ctx.minIndex[u] === ctx.index[u])
        {
            let v: number;
            do
            {
                v = ctx.sccStack.pop()!;
                ctx.onStack[v] = false;
                yield { colorVertex: [v, 'red'] };
            } while (v !== u);
        }
    }

    protected *_run(g: UnweightedGraph, config: TarjanConfig): IterableIterator<AlgorithmStep>
    {
        const ctx = new TarjanContext(g);

        if (config.traverseAll)
        {
            for (let u = 1; u <= g.vertexCount; u++)
            {
                if (ctx.index[u] === 0)
                {
                    yield* this._scc(g, u, ctx);
                }
            }
        }
        else
        {
            yield* this._scc(g, config.startVertex, ctx);
        }
    }

    public override configNode(): ReactNode
    {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<TarjanConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
                <Form.Item<TarjanConfig> name="traverseAll" valuePropName="checked">
                    <Checkbox>Duyệt tất cả các đỉnh</Checkbox>
                </Form.Item>
            </>
        )
    }
}