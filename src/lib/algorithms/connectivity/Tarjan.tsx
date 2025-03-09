import { ReactNode } from 'react';
import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from '../GraphAlgorithm';
import { Checkbox, Form, InputNumber } from 'antd';
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
    public override defaultConfig(): TarjanConfig 
    {
        return {
            startVertex: 1,
            traverseAll: false
        };
    }

    public override get code(): string
    {
        return `int num[MAX_N];
int minNum[MAX_N];
int scc[MAX_N];
int k;
Stack S;
int onStack[MAX_N];

void SCC(Graph* G, int u) {
    num[u] = minNum[u] = k; k++;
    push(&S, u);
    onStack[u] = 1; 

    for (int v = 1; v <= n; v++) {
        if (adjacent(G, u, v)) {
            if (!num[v]) {
                SCC(G, v);
                minNum[u] = min(minNum[u], minNum[v]);
            }
            else if (onStack[v])
                minNum[u] = min(minNum[u], num[v]);
        }
    }

    if (minNum[u] == num[u]) {
        int v;
        do {
            v = top(S); pop(&S);
            onStack[v] = 0;
            scc[v] = u;
        } while (v != u);
    }
}`;
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
        yield { codeLine: 8, log: `SCC(G, ${u})` };

        ctx.index[u] = ctx.minIndex[u] = ctx.sccCount++;
        yield { codeLine: 9, log: `num[${u}] = minNum[${u}] = ${ctx.index[u]}, k++ = ${ctx.sccCount}` };

        ctx.sccStack.push(u);
        yield { codeLine: 10, log: `S = {${ctx.sccStack.toArray().join(', ')}}` };

        ctx.onStack[u] = true;
        yield { codeLine: 11, log: `onStack[${u}] = true`, colorVertex: [u, 'gray'] };

        yield { codeLine: 13, log: `v = 1` };
        for (let v = 1; v <= g.vertexCount; v++)
        {
            yield { codeLine: 14, log: `G->A[${u}][${v}] = ${g.matrix[u][v]}` };
            if (g.adjacent(u, v))
            {
                yield { codeLine: 15, log: `num[${v}] = ${ctx.index[v]}` };
                if (ctx.index[v] === 0)
                {
                    yield { codeLine: 16, log: 'Đệ quy gọi SCC(G, v)' };
                    yield* this._scc(g, v, ctx);
                    yield { codeLine: 17, log: `minNum[${u}] = min(minNum[${u}], minNum[${v}]) = min(${ctx.minIndex[u]}, ${ctx.minIndex[v]}) = ${Math.min(ctx.minIndex[u], ctx.minIndex[v])}` };
                    ctx.minIndex[u] = Math.min(ctx.minIndex[u], ctx.minIndex[v]);
                    continue;
                }
                
                yield { codeLine: 18, log: `onStack[${v}] = ${ctx.onStack[v]}` };
                if (ctx.onStack[v])
                {
                    yield { codeLine: 19, log: `minNum[${u}] = min(minNum[${u}], num[${v}]) = min(${ctx.minIndex[u]}, ${ctx.index[v]}) = ${Math.min(ctx.minIndex[u], ctx.index[v])}` };
                    ctx.minIndex[u] = Math.min(ctx.minIndex[u], ctx.index[v]);
                }
            }

            yield { codeLine: 13, log: `v = ${v + 1}` };
        }

        yield { codeLine: 24, log: `minNum[${u}] = ${ctx.minIndex[u]}, num[${u}] = ${ctx.index[u]}` };
        if (ctx.minIndex[u] === ctx.index[u])
        {
            yield { codeLine: 25, log: `v = -1` };
            let v: number;
            do
            {
                v = ctx.sccStack.pop()!;
                yield { codeLine: 27, log: `v = ${v}, S = {${ctx.sccStack.toArray().join(', ')}}` };
                ctx.onStack[v] = false;
                yield { codeLine: 28, log: `onStack[${v}] = false` };
                yield { codeLine: 29, log: `scc[${v}] = ${u}`, colorVertex: [v, 'red'] };
                yield { codeLine: 30, log: `v = ${v}, u = ${u}` };
            } while (v !== u);
        }
    }

    protected *_run(g: UnweightedGraph, config: TarjanConfig): IterableIterator<AlgorithmStep>
    {
        const ctx = new TarjanContext(g);
        yield { codeLine: 1, log: `num = {${ctx.index.join(', ')}}` };
        yield { codeLine: 2, log: `minNum = {${ctx.minIndex.join(', ')}}` };
        yield { codeLine: 3, log: `scc = {${Array(g.vertexCount + 1).fill(-1).join(', ')}}` };
        yield { codeLine: 4, log: `k = 1` };
        yield { codeLine: 5, log: `S = {}` };
        yield { codeLine: 6, log: `onStack = {${ctx.onStack.join(', ')}}` };

        yield* this._scc(g, config.startVertex, ctx);
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