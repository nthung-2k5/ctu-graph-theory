import { ReactNode } from 'react';
import { AlgorithmRequirements, AlgorithmStep, WeightedGraphAlgorithm } from '../GraphAlgorithm';
import { WeightedGraph } from '../WeightedGraph';
import store from '../../context/store';
import { Queue } from "data-structure-typed";
import { UnweightedGraph } from '../UnweightedGraph';

class FlowContext
{
    public found: boolean;

    public parent: number[];

    public flow: number[][];
    
    constructor(graph: WeightedGraph)
    {
        const n = graph.vertexCount;
        this.found = false;
        this.parent = Array(n + 3).fill(-1);
        this.flow = Array(n+3).fill(0).map(() => Array(n + 3).fill(0));
    }
}

interface FlowResult 
{
    maximumFlow: number,
    S: number[],
    T: number[]
}

export default class FlowAlgorithm extends WeightedGraphAlgorithm<object, FlowResult>
{
    protected override _initResult(): FlowResult 
    {
        return {
            maximumFlow: 0,
            S: [],
            T: [],
        }
    }

    protected override _result(result: FlowResult): ReactNode 
    {
        return (
            <>
                <p>Luồng cực đại: {result.maximumFlow}</p>
                <p>Lát cắt hẹp nhất:</p>
                <p>Lát cắt S: {result.S.join(', ')} </p>
                <p>Lát cắt T: {result.T.join(', ')} </p>
            </>
        )
    }

    public override defaultConfig(): object 
    {
        return {};
    }

    public override get code(): string 
    {
        return `int flow[MAX_N][MAX_N];

int TimDuongTangLuong(Graph* G, int s, int t, int parent[]) {
    for (int u = 1; u <= n; u++) {
        parent[u] = -1;
    }

    Queue Q; makeNullQueue(&Q);
    
    enqueue(&Q, s);
    parent[s] = s;
    while (!empty(Q)){
        int u = front(Q);
        dequeue(&Q);

        for (int v = 1; v <= n; v++) {
            if (adjacent(G, u, v)) {
                if (parent[v] == -1 && G->W[u][v] > flow[u][v]) {
                    enqueue(Q, v);
                    parent[v] = u;
                }
            }
        }
    }

    return (parent[t] != -1);
}

#define oo 1000000007
void TangLuong(Graph* G, int s, int t, int parent[], int* maxFlow) {
    int v     = t;
    int delta = oo;
    while (v != s) {
        int u = parent[v];
        delta = min(delta, G->W[u][v] - flow[u][v]);
        v = u;
    }

    v = t;
    while (v != s) {
        int u = parent[v];
        flow[u][v] += delta;
        flow[v][u] -= delta;
        v = u;
    }

    *maxFlow += delta;
}

int EdmondsKarp(Graph* G, int s, int t) {
    int maxFlow = 0;
    int parent[G->n + 1];
    
    while (TimDuongTangLuong(&G, s, t, parent)) {
        TangLuong(&G, s, t);
    }

    return maxFlow;
}`
    }

    public override get predicate(): AlgorithmRequirements
    {
        return {
            weighted: true,
            acyclic: true,
            directed: true,
        }
    }
    
    public get name(): string
    {
        return 'Tìm luồng cực đại trong mạng (Thuật toán Edmonds-Karp)';
    }

    private *_TimDuongTangLuong(g: WeightedGraph, s: number, t: number, ctx: FlowContext, result: FlowResult): IterableIterator<AlgorithmStep>
    {
        yield { codeLine: 3, log: `TimDuongTangLuong(G, ${s}, ${t}, parent)` };
        
        const n = g.vertexCount;

        yield { codeLine: [4, 6], log: `parent[1..${n}] = -1` };

        ctx.parent = Array(n + 1).fill(-1);
        result.S = [];
        result.T = [];

        const Q = new Queue<number>();
        yield {codeLine: 8, log: `Q = {}`};

        Q.push(s);
        yield {codeLine: 10, log: `Q = {${s}}`};
        
        ctx.parent[s] = s;
        yield {codeLine: 11, log: `parent[${s}] = ${s}`, borderColorVertex: [s, 'red'] };

        while (1)
        {
            yield { codeLine: 12, log: `Q = {${Q.toArray().join(', ')}} => !empty(Q) = ${!Q.isEmpty()}` };
            if (Q.isEmpty()) break;

            const u = Q.shift()!;
            yield { codeLine: 13, log: `u = ${u}`, backgroundColorVertex: [u, 'orange'], contentColorVertex: [u, "white"], borderColorVertex: [u, 'default'] };
            yield { codeLine: 14, log: `Q = {${Q.toArray().join(', ')}}` };

            for (const { v, weight: capacity } of g.neighbors(u))
            {
                yield {codeLine: [16, 17], log: `Xét đỉnh ${v}`, highlightVertex: [v, true], highlightEdge: [u, v, true] };
                
                yield { codeLine: 18, log: `(parent[${v}] = ${ctx.parent[v]}) == -1 => ${ctx.parent[v] == -1}, (G->W[${u}][${v}] = ${capacity}) > (flow[${u}][${v}] = ${ctx.flow[u][v]}) => ${capacity > ctx.flow[u][v]}` };
                if (ctx.parent[v] == -1 && capacity > ctx.flow[u][v])
                {
                    Q.push(v);
                    yield { codeLine: 19, log: `Q = {${Q.toArray().join(', ')}}`, borderColorVertex: [v, 'red'] };

                    ctx.parent[v] = u;
                    yield { codeLine: 20, log: `parent[${v}] = ${u}`, colorEdge: [u, v, 'orange'], borderColorVertex: [v, 'red'] };

                }

                yield { codeLine: 23, log: `Kết thúc xét đỉnh ${v}`, highlightVertex: [v, false], highlightEdge: [u, v, false] };
            }

            yield {  codeLine: 24, log: `Kết thúc xét đỉnh ${u}`, backgroundColorVertex: [u, 'deepskyblue'], contentColorVertex: [u, 'white'] };
        }

        yield { codeLine: 26, log: `Kết quả trả về: (parent[${t}] = ${ctx.parent[t]}) != -1 => ${ctx.parent[t] != -1}` };
        ctx.found = ctx.parent[t] != -1;

        for (let v = 1; v <= g.vertexCount; v++)
        {
            if (ctx.parent[v] == -1)
            {
                result.T.push(v);
            }
            else 
            {
                result.S.push(v);
            }
        }
    }

    private *_TangLuong(g: WeightedGraph, s: number, t:number, ctx: FlowContext, result: FlowResult): IterableIterator<AlgorithmStep>
    {
        yield { codeLine: 30, log: `TangLuong(G, ${s}, ${t}, parent, &maxFlow)` };

        let v = t;
        yield { codeLine: 31, log: `v = ${v}`, highlightVertex: [v, true], backgroundColorVertex: [v, 'deepskyblue'], contentColorVertex: [v, "white"] };
        
        let delta = Infinity;
        yield { codeLine: 32, log: `delta = ∞` };
        
        const augPath = [];
        augPath.push(t);
        while (1)
        {
            yield { codeLine: 33, log: `(v = ${v}) != ${s} => ${v != s}` };
            if (v == s) break;

            const u = ctx.parent[v];
            
            yield {
                codeLine: 34,
                log: `u = parent[${v}] = ${u}`,
                colorEdge: [u, v, 'deepskyblue'],
                backgroundColorVertex: [u, 'deepskyblue'],
                contentColorVertex: [u, "white"]
            };

            const w = g.weight(u, v);
            yield {codeLine: 35, log: `delta = min(${delta}, ${w} - ${ctx.flow[u][v]}) = ${Math.min(delta, w - ctx.flow[u][v])}`};
            delta = Math.min(delta, w - ctx.flow[u][v]);
            
            yield {
                codeLine: 36,
                log: `v = ${u}`,
                highlightVertex: [[v, false], [u, true]]
            };
            v = u;
            augPath.push(v);
        }


        yield {codeLine: 37, log: `=> delta = ${delta}, Đường tăng luồng: ${augPath.toReversed().join(' -> ')}`, highlightVertex: [v, false] };

        v = t;
        yield { codeLine: 39, log: `v = ${v}`, highlightVertex: [v, true], backgroundColorVertex: [v, 'tomato'], contentColorVertex: [v, "white"] };
        
        while (1)
        {
            yield { codeLine: 40, log: `(v = ${v}) != ${s} => ${v != s}` };
            if (v == s) break;

            const u = ctx.parent[v];
            yield {
                codeLine: 41,
                log: `u = parent[${v}] = ${u}`,
                colorEdge: [u, v, 'red'],
                backgroundColorVertex: [u, 'tomato'],
                contentColorVertex: [u, "white"]
            };

            ctx.flow[u][v] += delta;
            const w = g.weight(u, v);
            yield { codeLine: 42, log: `(flow[${u}][${v}] += ${delta}) = ${ctx.flow[u][v]}`, colorEdge: [u, v, 'red'], labelEdge: [u, v, `${ctx.flow[u][v]}/${w}`] };
            
            ctx.flow[v][u] -= delta;
            yield { codeLine: 43, log: `(flow[${v}][${u}] -= ${delta}) = ${ctx.flow[v][u]}`, colorEdge: [v, u, 'red'], labelEdge: [v, u, `${ctx.flow[v][u]}/${w}`] };

            yield {
                codeLine: 44,
                log: `v = ${u}`,
                highlightVertex: [[v, false], [u, true]]
            };
            v = u;
        }

        result.maximumFlow += delta;
        yield {codeLine: 47, log: `(maxFlow += ${delta}) = ${result.maximumFlow + delta}`, reset: true };
    }

    protected override *_run(g: WeightedGraph, _config: object, result: FlowResult): IterableIterator<AlgorithmStep>
    {
        const ctx = new FlowContext(g);
        const graph = store.getState().graph;
        const tempGraph = new UnweightedGraph(graph.vertexCount, graph.directed);
        for (const edge of graph.edges)
        {
            tempGraph.addEdge(edge);
        }
        
        let s = null;
        let t = null;

        for (let i = 1; i <= graph.vertexCount && (s === null || t === null); i++)
        {
            const inDegree = tempGraph.inDegree(i);
            const outDegree = tempGraph.outDegree(i);

            if (inDegree === 0)
            {
                s = i;
            }

            if (outDegree === 0)
            {
                t = i;
            }
        }

        if (s === null || t === null)
        {
            throw new Error("Invalid graph");
        }

        const labelFlows: [number, number, string][] = [];
        for (const e of g.edges)
        {
            labelFlows.push([e.u, e.v, `0/${e.weight}`]);
        }

        const n = g.vertexCount;
        yield { codeLine: 1, log: `flow[1..${n}][1..${n}] = 0`, labelEdge: labelFlows };

        yield { codeLine: 50, log: `EdmondsKarp(G, ${s}, ${t})` };
        yield { codeLine: 51, log: 'maxFlow = 0' };
        yield { codeLine: 52, log: `parent[1..${n}] = {}` };

        while (1)
        {
            yield {codeLine: 54, log: `while (TimDuongTangLuong(G, ${s}, ${t}, parent))`};
            yield* this._TimDuongTangLuong(g, s, t, ctx, result);
            
            if (!ctx.found)
            {
                yield {codeLine: 56, log: "Không còn đường tăng luồng nào nữa. Huhu =[[["};
                break;
            }

            yield {codeLine: 55, reset: true, log: `TangLuong(G, ${s}, ${t}, parent, &maxFlow)`};
            yield* this._TangLuong(g, s, t, ctx, result);
        }

        yield {codeLine: 58, reset: true, log: `Kết quả cuối cùng: luồng cực đại = ${result.maximumFlow}`};

        /// TODO: Min Cut
    }
}
