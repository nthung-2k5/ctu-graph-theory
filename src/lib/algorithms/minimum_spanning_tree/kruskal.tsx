import { ReactNode } from "react";
import { AlgorithmRequirements, AlgorithmStep, WeightedGraphAlgorithm } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { Form, InputNumber } from "antd";
import store from "../../context/store";

export interface KruskalConfig
{
    startVertex: number;
    traverseAll: boolean;
}

interface KruskalResult
{
    kruskal: Map<number, number>;
    totalTree: number;
}

class KruskalContext 
{
    
}

export default class Kruskal extends WeightedGraphAlgorithm<KruskalConfig, KruskalResult> 
{
    // xong
    protected override _initResult(): KruskalResult 
    {
        return {
            kruskal: new Map<number, number>(),
            totalTree: 0
        };
    }

    // xong
    protected override _result(result: KruskalResult): ReactNode
    {
        return (
            <>
                <p>Danh sách cạnh của cây khung nhỏ nhất:</p>
                {[...result.kruskal].map(([key, value]) => (
                    <p>${key} ${value}</p>
                ))}
                <p>${result.totalTree}</p>
            </>
        );
    }

    // xong
    public override defaultConfig(): KruskalConfig 
    {
        return { 
            startVertex: 1,
            traverseAll: false
        };
    }

    // xong
    public override get code(): string
    {
        return `int findRoot(Graph graph, int u) {
    while (u != parent[u])
        u = parent[u];
    return u;
}

int kruskal(Graph *G, Graph *tree) {
    int weight = 0;

    // Sắp xếp cạnh của đồ thị theo thứ tự tăng dần
    for (int i = 0; i < G->m; i++)
        for (int j = i + 1; j < G->m; j++)
            if (G->edges[i].w > G->edges[j].w)
                swap(&G->edges[i], &G->edges[j]);

    for (int i = 1; i <= G->n; i++) parent[i] = i;
 
    // Tạo cây khung rỗng
    init_graph(tree, G->n);
    for (int i = 0; i < G->m; i++) {
        int u = G->edges[i].u;
        int v = G->edges[i].v;
        int w = G->edges[i].w;
        int rootu = findRoot(*G, u);
        int rootv = findRoot(*G, v);

        if (rootu != rootv) {
            add_edge(tree, u, v, w);
            weight += w;
            parent[rootv] = rootu;
        }
    }
    
    return weight;
}`;
    }

    // xong
    public get name(): string 
    {
        return 'Kruskal';
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
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<KruskalConfig> label="Đỉnh bắt đầu" name="startVertex">
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
            </>
        )
    }

    private *_kruskal(g: WeightedGraph, ctx: KruskalContext, result: number[]): IterableIterator<AlgorithmStep>
    {

    }

    protected override *_run(g: WeightedGraph, config: KruskalConfig, result: KruskalResult): IterableIterator<AlgorithmStep> 
    {
        
    } 
}