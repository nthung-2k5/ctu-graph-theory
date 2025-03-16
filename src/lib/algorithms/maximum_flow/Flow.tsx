import { ReactNode } from 'react';
import { AlgorithmRequirements, AlgorithmStep, WeightedGraphAlgorithm } from '../GraphAlgorithm';
import { WeightedGraph } from '../WeightedGraph';
import store from '../../context/store';
import { Queue } from "data-structure-typed";
import { KEYWORD } from 'color-convert/conversions';
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

int TimDuongTangLuong(Graph *G, int s, int t, int parent[]) {
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
void TangLuong(Graph *G, int s, int t, int parent[], int* maxFlow) {
    int v     = t;
    int delta = oo;
    while (v != s) {
        int u = parent[v];
        delta = min(delta, G->A[u][v] - flow[u][v]);
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

int EdmondsKarp(Graph *G, int s, int t) {
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
        return 'Luồng cực đại';
    }

    private *_TimDuongTangLuong(g: WeightedGraph, s: number, t: number, ctx: FlowContext, result: FlowResult): IterableIterator<AlgorithmStep>
    {
        yield {codeLine: 3, log: `TimDuongTangLuong(G, ${s}, ${t}), parent`};
        
        const n = g.vertexCount;

        yield {codeLine: [4, 6], log: `parent[1..${g.vertexCount}] = -1`};

        ctx.parent = Array(n + 1).fill(-1);
        result.S = [];
        result.T = [];

        const Q = new Queue<number>();
        yield {codeLine: 8, log: `Q = {}`};
        yield {codeLine: 10, log: `Q = {${s}}`};
        Q.push(s);
        
        ctx.parent[s] = s;
        
        const edges: Array<[number, number, KEYWORD]> = [];
        const contentVerties: Array<[number, KEYWORD]> = [];
        const verties: Array<[number, KEYWORD]> = [];

        while (!Q.isEmpty())
        {
            const u = Q.shift()!;
            yield { codeLine: 13, log: `u = ${u}`, borderColorVertex: [u, "deeppink"], backgroundColorVertex: [u, "mediumpurple"], contentColorVertex: [u, "whitesmoke"] };
            yield { codeLine: 14, log: `Q = {${Q.toArray().join(', ')}}` };

            for (const { v, weight: capacity } of g.neighbors(u))
            {
                yield {codeLine: [16, 17], log: `Xét đỉnh ${v}`, borderColorVertex: [v, 'deeppink'], backgroundColorVertex: [v, 'darkorange'], contentColorVertex: [v, 'whitesmoke'] };
                
                yield { codeLine: 18, log: `(parent[${v}] = ${ctx.parent[v]}) == -1 => ${ctx.parent[v] == -1}, (G->W[${u}][${v}] = ${capacity}) > (flow[${u}][${v}] = ${ctx.flow[u][v]}) => ${capacity > ctx.flow[u][v]}`, borderColorVertex: [v, 'deeppink'], backgroundColorVertex: [v, 'darkorange'], contentColorVertex: [v, 'whitesmoke'] };
                if (ctx.parent[v] == -1 && capacity > ctx.flow[u][v])
                {
                    yield { log: `((${u}, ${v}), ${capacity - ctx.flow[u][v]})`, colorEdge: [u, v, 'dodgerblue']};
                    edges.push([u, v, 'black']);
                    Q.push(v);
                    yield { codeLine: 19, log: `Q = {${Q.toArray().join(', ')}}`, colorVertex: [v, 'deeppink'], borderColorVertex: [v, 'black'] };
                    yield { codeLine: 20, log: `parent[${v}] = ${u}`, borderColorVertex: [v, 'black'], backgroundColorVertex: [v, 'darkorange'] };
                    ctx.parent[v] = u;
                }
            }

            yield {codeLine: 22, log: ``, borderColorVertex: [u, 'black'], contentColorVertex: [u, 'whitesmoke'], backgroundColorVertex: [u, 'darkorange']}
            verties.push([u, 'white']);
            contentVerties.push([u, 'black'])
        }

        yield { codeLine: 26, log: `Kết quả trả về: (parent[${t}] = ${ctx.parent[t]}) != -1 => ${ctx.parent[t] != -1}`, reset: true };
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
        yield { codeLine: 31, log: `v = ${v}` };
        let del = 1000000007;
        yield { codeLine: 32, log: `delta = ∞` };

        yield { codeLine: 30, log: `Đường tăng luồng: `, borderColorVertex: [v, "deeppink"], backgroundColorVertex: [v, "mediumpurple"], contentColorVertex: [v, "whitesmoke"] };
        
        while (1)
        {
            yield { codeLine: 33, log: `(v = ${v}) != ${s} => ${v != s}` };
            if (v == s) break;

            const u = ctx.parent[v];
            yield { log: `u = ${u}`, codeLine: 34 };
            
            const w = g.weight(u, v);
            yield {
                codeLine: 34,
                log: `((${u}, ${v}), ${w - ctx.flow[u][v]})`,
                colorEdge: [u, v, 'dodgerblue'],
                borderColorVertex: [v, "deeppink"], backgroundColorVertex: [v, "mediumpurple"], contentColorVertex: [v, "whitesmoke"]
            };

            yield {codeLine: 35, log: `del = min(${del}, ${w} - ${ctx.flow[u][v]}) = ${Math.min(del, w - ctx.flow[u][v])}`};
            del = Math.min(del, w - ctx.flow[u][v]);
            v = u;
            yield {codeLine: 36, log: `v = ${v}`};
        }
        yield {codeLine: 37, log: "", borderColorVertex: [v, "deeppink"], backgroundColorVertex: [v, "mediumpurple"], contentColorVertex: [v, "whitesmoke"]}

        v = t;
        yield { codeLine: 39, log: `v = ${v}` };
        while (1)
        {
            yield { codeLine: 40, log: `(v = ${v}) != ${s} => ${v != s}` };
            if (v == s) break;

            const u = ctx.parent[v];
            yield { codeLine: 41, log: `u = ${u}` };

            ctx.flow[u][v] += del;
            const w = g.weight(u, v);
            yield { codeLine: 42, log: `(flow[${u}][${v}] += ${del}) = ${ctx.flow[u][v]}`, labelEdge: [u, v, `${ctx.flow[u][v]}/${w}`] };
            
            ctx.flow[v][u] -= del;
            yield { codeLine: 43, log: `(flow[${v}][${u}] -= ${del}) = ${ctx.flow[v][u]}`, labelEdge: [v, u, `${ctx.flow[v][u]}/${w}`] };

            v = u;
            yield { codeLine: 44, log: `v = ${v}` };
        }

        result.maximumFlow += del;
        yield {codeLine: 47, log: `(maxFlow += ${del}) = ${result.maximumFlow + del}`, reset: true };
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

        const labelFlows: Array<[number, number, string]> = [];
        for (const e of g.edges)
        {
            labelFlows.push([e.u, e.v, `0/${e.weight}`]);
        }

        yield { codeLine: 1, log: `flow[1..${g.vertexCount}][1..${g.vertexCount}] = 0`, labelEdge: labelFlows };

        yield { codeLine: 50, log: `EdmondsKarp(G, ${s}, ${t})` };
        yield { codeLine: 51, log: 'maxFlow = 0' };
        yield { codeLine: 52, log: `parent[${g.vertexCount + 1}] = {}` };

        while (1)
        {
            yield {codeLine: 54, log: `while (TimDuongTangLuong(G, ${s}, ${t}, parent))`};
            yield* this._TimDuongTangLuong(g, s, t, ctx, result);
            
            if (!ctx.found)
            {
                yield {codeLine: 56, log: "Không còn đường tăng luồng nào nữa. Huhu =[[["};
                break;
            }

            yield {codeLine: 55, log: `TangLuong(G, ${s}, ${t}, parent, &maxFlow)`};
            yield* this._TangLuong(g, s, t, ctx, result);
        }

        yield {codeLine: 58, log: `Kết quả cuối cùng: luồng cực đại = ${result.maximumFlow}`};

        /// TODO: Min Cut
    }
}
