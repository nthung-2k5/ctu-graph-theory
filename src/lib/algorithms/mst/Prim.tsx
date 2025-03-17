import { ReactNode } from "react";
import { AlgorithmRequirements, AlgorithmStep } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { Form, InputNumber } from "antd";
import store from "../../context/store";
import { MSTAlgorithm, MSTResult } from './MSTAlgorithm';
import { KEYWORD } from 'color-convert/conversions';

export interface PrimConfig 
{
    startVertex: number;
}

export default class Prim extends MSTAlgorithm<PrimConfig> 
{
    public override defaultConfig(): PrimConfig 
    {
        return {
            startVertex: 1,
        };
    }

    public override get code(): string 
    {
        return `int p[MAX_N];
int mark[MAX_N];
int dist[MAX_N];

#define oo 1000000007

int Prim(Graph* G, Graph* tree, int s) {
    // 1. Khởi tạo
    for (int u = 1; u <= G->n; u++) {
        dist[u] = oo; // Khởi tạo dist[u] = vô cùng
        p[u] = -1; // p[u] chưa xác định
        mark[u] = 0; // Đỉnh chưa được đánh dấu
    }

    dist[s] = 0; // Chỉ có dist[s] = 0

    // 2. Lặp n - 1 lần
    for (int i = 1; i < G->n; i++) {
        // 2a. Tìm u gần với S nhất (tìm u có dist[u] nhỏ nhất)
        int u = -1;
        int minDist = oo;
        for (int x = 1; x <= G->n; x++) {
            if (!mark[x] && dist[x] < minDist) {
                minDist = dist[x];
                u = x;
            }
        }
        // 2b. Đánh dấu u
        mark[u] = 1;

        // 2c. Cập nhật lại dist và p của các đỉnh kề v của u
        for (int v = 1; v <= G->n; v++) {
            if (G->W[u][v] != NO_EDGE) {
                if (!mark[v] && dist[v] > G->W[u][v]) {
                    dist[v] = G->W[u][v];
                    p[v] = u;
                }
            }
        }
    }

    // 3. Dựng cây dựa vào p[u]: thêm các cung (p[u], u) vào cây T
    initGraph(tree, G->n); // Khởi tạo cây T rỗng
    int weight = 0; // Tổng trọng số của cây T

    for (int u = 1; u <= G->n; u++) {
        if (p[u] != -1) {
            int w = G->W[p[u]][u];
            addEdge(tree, p[u], u, w);
            weight += w;
        }
    }
    return weight;
}`;
    }

    public get name(): string 
    {
        return "Cây khung vô hướng nhỏ nhất (Thuật toán Prim)";
    }

    public override get predicate(): AlgorithmRequirements 
    {
        return {
            directed: false,
            weighted: true,
        };
    }

    public override configNode(): ReactNode 
    {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<PrimConfig> label="Đỉnh bắt đầu" name="startVertex">
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
            </>
        );
    }

    protected override *_run(g: WeightedGraph, config: PrimConfig, result: MSTResult): IterableIterator<AlgorithmStep> 
    {
        yield { log: `Prim(G, tree, ${config.startVertex})`, codeLine: 7 };

        const n = g.vertexCount;
        const mark = Array<boolean>(n + 1).fill(false);
        const dist = Array<number>(n + 1).fill(Infinity);
        const parent = Array<number>(n + 1).fill(-1);

        yield { log: `Khởi tạo dist[], p[], mark[]`, codeLine: [9, 13] };
        yield { log: `dist[1..${n}] = ∞` };
        yield { log: `p[1..${n}] = -1` };
        yield { log: `mark[1..${n}] = 0` };

        const s = config.startVertex;
        dist[config.startVertex] = 0;

        yield { log: `dist[${s}] = 0`, codeLine: 15 };

        yield { log: `for (int i = 1; i < ${n}; i++)`, codeLine: 18 };
        for (let i = 1; i < n; i++)
        {
            yield { log: 'u = -1', codeLine: 20 };
            yield { log: `minDist = ∞`, codeLine: 21 };

            let u = -1, minDist = Infinity;

            // Tìm đỉnh u có dist[u] nhỏ nhất và chưa được đánh dấu
            yield { log: `Xét các đỉnh chưa được duyệt`, codeLine: [22, 27] };
            const unmarked = [];
            for (let x = 1; x <= n; x++) 
            {
                if (!mark[x]) 
                {
                    yield { log: `dist[${x}] = ${dist[x] === Infinity ? '∞': dist[x]}`, borderColorVertex: [x, "red"] };
                    if (dist[x] < minDist)
                    {
                        minDist = dist[x];
                        u = x;
                    }

                    unmarked.push(x);
                }
            }

            yield {
                log: `=> u = ${u}, minDist=${minDist}`,
                highlightVertex: [u, true],
                borderColorVertex: [...unmarked.map(x => [x, 'default']) as [number, 'default'][], [u, 'red']],
            };

            mark[u] = true;
            yield { log: `mark[${u}] = 1`, codeLine: 29, backgroundColorVertex: [u, "deepskyblue"], contentColorVertex: [u, "white"] };

            // Cập nhật dist và parent của các đỉnh kề v của u
            for (const { v, weight } of g.neighbors(u)) 
            {
                yield { log: `Xét đỉnh ${v}`, codeLine: [32, 33], highlightVertex: [v, true], highlightEdge: [u, v, true] };
                
                yield {
                    log: `!(mark[${v}] = ${mark[v] ? 1 : 0}) => ${!mark[v]}, (dist[v] = ${dist[v]}) > (G->W[u][v] = ${weight}) => ${dist[v] > weight}`,
                    codeLine: 34,
                };

                if (!mark[v] && dist[v] > weight) 
                {
                    dist[v] = weight;
                    yield {
                        log: `dist[${v}] = ${weight}`,
                        codeLine: 32,
                        backgroundColorVertex: [v, "orange"],
                        contentColorVertex: [v, "white"]
                    };

                    yield { log: `p[${v}] = ${u}`, codeLine: 36, colorEdge: [[parent[v], v, 'default'], [u, v, "deepskyblue"]] };
                    parent[v] = u;
                }

                yield { log: `Kết thúc xét đỉnh ${v}`, codeLine: 39, highlightVertex: [v, false], highlightEdge: [u, v, false] };
            }

            yield {
                log: `Kết thúc duyệt đỉnh ${u}, i = ${i + 1}`,
                codeLine: 35,
                highlightVertex: [u, false],
                borderColorVertex: [u, 'default']
            };
        }

        yield {
            log: `Khởi tạo cây khung kết quả với ${n} đỉnh`,
            codeLine: 43,
            backgroundColorVertex: Array.from({ length: n }, (_, i) => [i + 1, 'deepskyblue']) as [number, KEYWORD][],
            contentColorVertex: Array.from({ length: n }, (_, i) => [i + 1, 'white']) as [number, KEYWORD][]
        };

        yield { log: `weight = 0`, codeLine: 44 };
        for (let u = 1; u <= n; u++) 
        {
            yield { log: `Xét đỉnh ${u}`, codeLine: [46, 47], highlightVertex: [u, true] };
            yield { log: `(parent[${u}] = ${parent[u]}) != -1 => ${parent[u] !== -1}`, codeLine: 47 };
            if (parent[u] !== -1)
            {
                yield { log: `w = G->W[${parent[u]}][${u}]`, codeLine: 48 };
                
                result.tree.add(parent[u], [u, dist[u]]);
                yield { log: `addEdge(tree, ${parent[u]}, ${u}, ${dist[u]})`, codeLine: 49, highlightEdge: [parent[u], u, true], highlightVertex: [parent[u], true] };
                
                result.totalWeight += dist[u];
                yield { log: `(weight += ${dist[u]}) = ${result.totalWeight}`, codeLine: 50 };
            }

            yield {
                log: `Kết thúc xét đỉnh ${u}`,
                codeLine: 52,
                highlightVertex: (parent[u] !== -1) ? [[parent[u], false], [u, false]] : [u, false],
                highlightEdge: (parent[u] !== -1) ? [parent[u], u, false] : undefined,
            };
        }
        
        yield { log: `Kết quả trả về: tổng trọng số nhỏ nhất = ${result.totalWeight}`, codeLine: 53 };
        yield { log: `Kết thúc thuật toán`, codeLine: 54 };
    }
}
