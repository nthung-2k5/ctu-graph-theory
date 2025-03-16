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

export default class TarjanAlgorithm extends NeutralGraphAlgorithm<TarjanConfig, number[][]>
{
    protected override _initResult(): number[][] 
    {
        return [];
    }

    protected override _result(result: number[][]): ReactNode 
    {
        return (
            <>
                <p>Các bộ phận liên thông mạnh:</p>
                <ul>
                    {result.map((scc, i) => (
                        <li key={i}>SCC {i + 1}: {scc.toSorted((a, b) => a - b).join(', ')}</li>
                    ))}
                </ul>
            </>
        );
    }

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
        int v = -1;
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

    private *_scc(g: UnweightedGraph, u: number, ctx: TarjanContext, result: number[][]): IterableIterator<AlgorithmStep>
    {
        yield { codeLine: 8, log: `SCC(G, ${u})` };

        ctx.index[u] = ctx.minIndex[u] = ctx.sccCount++;
        yield { codeLine: 9, log: `num[${u}] = minNum[${u}] = ${ctx.index[u]}, k++ = ${ctx.sccCount}` };

        ctx.sccStack.push(u);
        yield { codeLine: 10, borderColorVertex: [u, 'red'], highlightVertex: [u, true], log: `S = {${ctx.sccStack.toArray().join(', ')}}` };

        ctx.onStack[u] = true;
        yield { codeLine: 11, log: `onStack[${u}] = 1` };

        for (const v of g.neighbors(u))
        {
            yield { codeLine: [13, 14], log: `Xét đỉnh ${v}`, highlightEdge: [u, v, true] };
            yield { codeLine: 15, log: `num[${v}] = ${ctx.index[v]} => ${ctx.index[v] === 0}` };
            if (ctx.index[v] === 0)
            {
                yield { codeLine: 16, log: `SCC(G, ${v})` };
                yield* this._scc(g, v, ctx, result);
                yield { codeLine: 17, log: `minNum[${u}] = min(minNum[${u}], minNum[${v}]) = min(${ctx.minIndex[u]}, ${ctx.minIndex[v]}) = ${Math.min(ctx.minIndex[u], ctx.minIndex[v])}` };
                ctx.minIndex[u] = Math.min(ctx.minIndex[u], ctx.minIndex[v]);
            }
            else
            {
                yield { codeLine: 19, log: `onStack[${v}] = ${ctx.onStack[v] ? 1 : 0} => ${ctx.onStack[v]}` };
                if (ctx.onStack[v])
                {
                    yield { codeLine: 20, log: `minNum[${u}] = min(minNum[${u}], num[${v}]) = min(${ctx.minIndex[u]}, ${ctx.index[v]}) = ${Math.min(ctx.minIndex[u], ctx.index[v])}` };
                    ctx.minIndex[u] = Math.min(ctx.minIndex[u], ctx.index[v]);
                }
            }
            yield { codeLine: 22, log: `Kết thúc xét đỉnh ${v}`, highlightEdge: [u, v, false] };
        }

        yield { codeLine: 24, log: `(minNum[${u}] = ${ctx.minIndex[u]}) == (num[${u}] = ${ctx.index[u]}) => ${ctx.minIndex[u] === ctx.index[u]}` };
        if (ctx.minIndex[u] === ctx.index[u])
        {
            yield { codeLine: 25, log: `v = -1` };
            result.push([]);
            let v: number;
            let parent = u;
            do
            {
                v = ctx.sccStack.pop()!;
                result[result.length - 1].push(v);
                yield { codeLine: 27, log: `v = ${v}, S = {${ctx.sccStack.toArray().join(', ')}}`, borderColorVertex: [v, 'deepskyblue'] };
                ctx.onStack[v] = false;
                yield { codeLine: 28, log: `onStack[${v}] = 0` };
                yield { codeLine: 29, log: `scc[${v}] = ${u}`, backgroundColorVertex: [v, 'deepskyblue'], colorEdge: [v, parent, 'deepskyblue'], contentColorVertex: [v, 'white'] };
                parent = v;

                yield { codeLine: 30, log: `(v = ${v}) != (u = ${u}) => ${v != u}` };
                if (v === u) break;
            } while (1);
        }

        yield { codeLine: 32, log: `Kết thúc duyệt đỉnh ${u}`, highlightVertex: [u, false] };
    }

    protected *_run(g: UnweightedGraph, config: TarjanConfig, result: number[][]): IterableIterator<AlgorithmStep>
    {
        const ctx = new TarjanContext(g);
        yield { codeLine: 1, log: `num = {${ctx.index.join(', ')}}` };
        yield { codeLine: 2, log: `minNum = {${ctx.minIndex.join(', ')}}` };
        yield { codeLine: 3, log: `scc = {${Array(g.vertexCount + 1).fill(-1).join(', ')}}` };
        yield { codeLine: 4, log: `k = 1` };
        yield { codeLine: 5, log: `S = {}` };
        yield { codeLine: 6, log: `onStack = {${ctx.onStack.join(', ')}}` };

        yield* this._scc(g, config.startVertex, ctx, result);
        if (config.traverseAll)
        {
            for (let u = 1; u <= g.vertexCount; u++)
            {
                if (ctx.index[u] === 0)
                {
                    yield* this._scc(g, u, ctx, result);
                }
            }
        }
    }

    public override configNode(): ReactNode
    {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<TarjanConfig> label="Đỉnh bắt đầu" name="startVertex">
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
                <Form.Item<TarjanConfig> name="traverseAll" valuePropName="checked">
                    <Checkbox>Duyệt tất cả các đỉnh</Checkbox>
                </Form.Item>
            </>
        )
    }
}