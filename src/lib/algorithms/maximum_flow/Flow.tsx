import { ReactNode } from 'react';
import { AlgorithmRequirements, AlgorithmStep, WeightedGraphAlgorithm } from '../GraphAlgorithm';
import { WeightedGraph } from '../WeightedGraph';
import store from '../../context/store';
import { Queue } from "data-structure-typed";
import { Neighbor } from '../WeightedGraph';
import { KEYWORD } from 'color-convert/conversions';
import { UnweightedGraph } from '../UnweightedGraph';

class FlowContext
{
    public found: boolean;
    
    public queue: Queue<number>;

    public parent: number[];

    public flow: number[][];
    
    constructor(graph: WeightedGraph)
    {
        const n = graph.vertexCount;
        this.found = false;
        this.queue = new Queue<number>();
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
        return `int TimDuongTangLuong(Graph *G, int s, int t){
    for (int u = 1; u <= n; u++){
        parent[u] = -1;
    }

    Queue Q;
    makeNullQueue(&Q);
    
    enqueue(&Q, s);
    parent[s] = s;
    while (!empty(Q)){
        int u = front(Q);
        dequeue(&Q);

        for (int v = 1; v <= n; v++){
            if (adjacent(G, u, v)){
                if (parent[v] == -1 && capacity[u][v] - flow[u][v] > 0){
                    enqueue(Q, v);
                    parent[v] = u;
                }
            }
        }
    }

    return (parent[t] != -1);
}

#define oo 1000000007
void TangLuong(Graph *G, int s, int t){
    int v     = t;
    int delta = oo;
    while (v != s){
        int u = parent[v];
        del = min(del, capacity[u][v] - flow[u][v]);
        v = u;
    }

    v = t;
    while (v != s){
        int u = parent[v];
        flow[u][v] += del;
        flow[v][u] -= del;
        v = u;
    }

    maxFlow += del;
}

int main(){
    // bla bla, blo blo,...
    while (TimDuongTangLuong(&G, s, t)){
        TangLuong(&G, s, t);
    }
    // What you want is in the maxFlow variable
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
        yield {codeLine: 1, log: `TimDuongTangLuong(G, ${s}, ${t})`}
        
        const n = g.vertexCount;

        yield {codeLine: 2, log: "Reset parent[]"}
        ctx.parent = Array(n + 3).fill(-1);
        result.S = [];
        result.T = [];

        yield {codeLine: 9, log: `Bắt đầu duyệt từ đỉnh ${s}`}
        ctx.queue.push(s);
        
        ctx.parent[s] = s;
        
        const edges: Array<[number, number, KEYWORD]> = [];
        const contentVerties: Array<[number, KEYWORD]> = [];
        const verties: Array<[number, KEYWORD]> = [];

        while (!ctx.queue.isEmpty())
        {
            const u = ctx.queue.shift()!;
            yield {codeLine: 12, log: `Duyệt đỉnh ${u}`, borderColorVertex: [u, "deeppink"], backgroundColorVertex: [u, "mediumpurple"], contentColorVertex: [u, "whitesmoke"]}

            yield {codeLine: 15, log: "Cạnh tăng luồng:"}
            const list: Neighbor[] = g.neighbors(u);
            for (let i = 0; i < list.length; i++)
            {
                yield {codeLine: 16, log: ""}
                const v = list[i].v;
                const capacity = list[i].weight;
                
                yield {codeLine: 17, log: ""}
                if (ctx.parent[v] == -1 && capacity - ctx.flow[u][v] > 0)
                {
                    yield {log: `((${u}, ${v}), ${capacity - ctx.flow[u][v]})`, colorEdge: [u, v, 'dodgerblue']}
                    edges.push([u, v, 'black']);
                    yield {codeLine: 18, log: "", colorVertex: [v, 'deeppink'], borderColorVertex: [v, 'black']}
                    ctx.queue.push(v);
                    yield {codeLine: 19, log: ""}
                    ctx.parent[v] = u;
                }
            }

            yield {codeLine: 22, log: ``, borderColorVertex: [u, 'black'], contentColorVertex: [u, 'whitesmoke'], backgroundColorVertex: [u, 'darkorange']}
            verties.push([u, 'white']);
            contentVerties.push([u, 'black'])
        }

        yield {codeLine: 25, log: `Có đường tăng luồng không ta?`}
        if (ctx.parent[t] != -1)
        {
            ctx.found = true;
        }
        yield {codeLine: 26, log: ``, colorEdge: edges, colorVertex: verties, contentColorVertex: contentVerties}

        for (let v = 1; v <= n; v++)
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
        yield {codeLine: 29, log: `TangLuong(G, ${s}, ${t})`}

        let v = t;
        let del = 1000000007;
        
        const edges: Array<[number, number, KEYWORD]> = [];
        const contentVerties: Array<[number, KEYWORD]> = [];
        const verties: Array<[number, KEYWORD]> = [];

        yield {codeLine: 30, log: `Đường tăng luồng: `, borderColorVertex: [v, "deeppink"], backgroundColorVertex: [v, "mediumpurple"], contentColorVertex: [v, "whitesmoke"]}
        verties.push([v, 'white']);
        contentVerties.push([v, 'black'])
        
        while (v != s)
        {
            yield {log: ``, codeLine: 32}

            const u = ctx.parent[v];
            edges.push([u, v, 'black'])
            const hihi = g.list[u].find(n => n.v === v);
            
            let w = 0
            if (hihi)
            {
                w = hihi.weight;
            }
            
            yield {
                codeLine: 33,
                log: `((${u}, ${v}), ${w - ctx.flow[u][v]})`,
                colorEdge: [u, v, 'dodgerblue'],
                borderColorVertex: [v, "deeppink"], backgroundColorVertex: [v, "mediumpurple"], contentColorVertex: [v, "whitesmoke"]
            }
            verties.push([v, 'white']);
            contentVerties.push([v, 'black'])

            del = Math.min(del, w - ctx.flow[u][v]);
            yield {codeLine: 34, log: `del = ${del}`}
            v = u;
        }
        yield {codeLine: 36, log: "", borderColorVertex: [v, "deeppink"], backgroundColorVertex: [v, "mediumpurple"], contentColorVertex: [v, "whitesmoke"]}
        verties.push([v, 'white']);
        contentVerties.push([v, 'black'])

        v = t;
        while (v != s)
        {
            const u = ctx.parent[v];

            ctx.flow[u][v] += del;
            
            let hihi = g.list[u].find(n => n.v === v);
            
            let w = 0
            if (hihi)
            {
                w = hihi.weight;
            }
            
            if (w > 0)
            {
                yield {
                    log: "",
                    labelEdge: [u, v, `${ctx.flow[u][v]}/${w}`],
                }
            }
            
            ctx.flow[v][u] -= del;

            hihi = g.list[v].find(n => n.v === u);
            
            w = 0
            if (hihi)
            {
                w = hihi.weight;
            }
            
            if (w > 0)
            {
                yield {
                    log: "",
                    labelEdge: [u, v, `${ctx.flow[v][u]}/${w}`],
                }
            }

            v = u;
        }

        yield {codeLine: 46, log: `Tăng luồng thêm ${del} đơn vị`}
        result.maximumFlow += del;

        yield {codeLine: 47, log: ``, colorEdge: edges, colorVertex: verties, contentColorVertex: contentVerties, borderColorVertex: contentVerties}
    }

    protected override *_run(g: WeightedGraph, _config: object, result: FlowResult): IterableIterator<AlgorithmStep>
    {
        yield {codeLine: 50, log: "Chuẩn bị chưa?"}
        const ctx = new FlowContext(g)
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

        while (1)
        {
            ctx.found = false;
            yield {codeLine: 51, log: ""}
            yield* this._TimDuongTangLuong(g, s, t, ctx, result);
            
            if (ctx.found == false)
            {
                yield {codeLine: 53, log: "Không còn đường tăng luồng nào nữa. Huhu =[[["}
                break;
            }
            yield {codeLine: 52, log: ""}
            yield* this._TangLuong(g, s, t, ctx, result);
        }

        yield {codeLine: 58, log: `NICE!!! Max Flow = ${result.maximumFlow}`}

        /// TODO: Min Cut
    }
}
