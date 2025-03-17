import { ReactNode } from "react";
import { AlgorithmRequirements, AlgorithmStep } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { MSTAlgorithm, MSTResult } from './MSTAlgorithm';

export default class Kruskal extends MSTAlgorithm<object> 
{
    // xong
    public override defaultConfig(): object 
    {
        return {};
    }

    // xong
    public override get code(): string 
    {
        return `int parent[MAX_N];

int findRoot(int u) {
    while (u != parent[u])
        u = parent[u];
    return u;
}

int kruskal(Graph* G, Graph* tree) {
    // Sắp xếp cạnh của đồ thị theo thứ tự tăng dần
    for (int i = 0; i < G->m; i++)
        for (int j = i + 1; j < G->m; j++)
            if (G->edges[i].w > G->edges[j].w)
                swap(&G->edges[i], &G->edges[j]);
    
    // Tạo cây khung rỗng
    initGraph(tree, G->n);
    
    //Khởi tạo weight va parent[]
    int weight = 0;
    for (int i = 1; i <= G->n; i++) 
        parent[i] = i;
        
    //Thêm các cạnh để tạo cây khung nhỏ nhất.
    for (int i = 0; i < G->m; i++) {
        int u = G->edges[i].u;
        int v = G->edges[i].v;
        int w = G->edges[i].w;

        int rootU = findRoot(u);
        int rootV = findRoot(v);

        if (rootU != rootV) {
            addEdge(tree, u, v, w);
            weight += w;
            parent[rootV] = rootU;
        }
    }

    return weight;
}`;
    }

    // xong
    public get name(): string 
    {
        return "Cây khung vô hướng nhỏ nhất (Thuật toán Kruskal)";
    }

    // xong
    public override get predicate(): AlgorithmRequirements 
    {
        return {
            directed: false, // Đồ thị phải là không có hướng
            weighted: true,
        }; // Điều kiện của đồ thị
    }

    // xong
    public override configNode(): ReactNode 
    {
        return (<></>)
    }

    private findRoot(parent: number[], u: number) 
    {
        while (u != parent[u]) 
        {
            u = parent[u];
        }
        
        return u;
    }

    protected override *_run(g: WeightedGraph, _config: object,  result: MSTResult): IterableIterator<AlgorithmStep> 
    {
        const parent = Array(g.vertexCount + 1).fill(0);
        const p = Array(g.vertexCount + 1).fill(-1);
        // Lấy danh sách cạnh, lưu vào edges rồi sort edges
        const edges = g.edges;
        const m = g.edgeCount;
        const n = g.vertexCount;
        for (let i = 0; i < m; i++) 
        {
            for (let j = i + 1; j < m; j++) 
            {
                if (edges[i].weight > edges[j].weight)
                {
                    // swap bằng destructuring
                    [edges[i], edges[j]] = [edges[j], edges[i]];
                }
            }
        }

        yield { log: `Danh sách cung của đồ thị tăng dần:`, codeLine: [11, 14] };
        for (let i = 0; i < m; i++) 
        {
            yield { log: `G->edges[${i}] = (${edges[i].u}, ${edges[i].v}, ${edges[i].weight})` };
        }

        yield { log: `Khởi tạo cây khung kết quả với ${n} đỉnh`, codeLine: 17 };

        yield { log: `weight = 0`, codeLine: 20 };

        for (let i = 1; i <= g.vertexCount; i++)
        {
            parent[i] = i;
        }

        yield { log: `parent[1..${g.vertexCount}] = {${parent.join(', ')}}`, codeLine: [21, 22] };

        yield { log: `for (int i = 0; i < ${g.edgeCount}; i++)`, codeLine: 25 };
        for (let i = 0; i < m; i++) 
        {
            const u = edges[i].u;
            const v = edges[i].v;
            const w = edges[i].weight;

            yield {
                log: `(u, v, w) = (${u}, ${v}, ${w})`,
                codeLine: [26, 28],
                highlightEdge: [u, v, true],
                highlightVertex: [[u, true], [v, true]],
            };

            const rootU = this.findRoot(parent, u);
            yield { log: `rootU = ${rootU}`, codeLine: 30, borderColorVertex: [rootU, "orange"] };

            const rootV = this.findRoot(parent, v);
            yield { log: `rootV = ${rootV}`, codeLine: 31, borderColorVertex: [rootV, rootV == rootU ? "red" : "orange"] };

            yield { log: `${rootU} == ${rootV} => ${rootU == rootV}`, codeLine: 33 };
            if (rootU != rootV) 
            {
                result.tree.add(u, [v, w]);
                yield {
                    log: `addEdge(tree, ${u}, ${v}, ${w})`,
                    codeLine: 34,
                    colorEdge: [u, v, "deepskyblue"],
                    backgroundColorVertex: [[u, "deepskyblue"], [v, "deepskyblue"]],
                    contentColorVertex: [[u, "white"], [v, "white"]],
                };
                result.totalWeight += w;
                yield { log: `(weight += ${w}) = ${result.totalWeight}`, codeLine: 35 };
                parent[rootV] = rootU;
                p[v] = u;
                yield { log: `parent[${rootV}]=${rootU}`, codeLine: 36 };
            }

            yield {
                log: `i = ${i + 1}`,
                codeLine: 38,
                highlightEdge: [u, v, false],
                highlightVertex: [[u, false], [v, false]],
                borderColorVertex: [[rootU, "default"], [rootV, "default"]],
            };
        }

        yield { log: `Kết quả trả về: tổng trọng số nhỏ nhất = ${result.totalWeight}`, codeLine: 40 };
        yield { log: `Kết thúc thuật toán`, codeLine: 41 };
    }
}
