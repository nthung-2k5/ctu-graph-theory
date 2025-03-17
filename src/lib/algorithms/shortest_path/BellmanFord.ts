import { KEYWORD } from 'color-convert/conversions';
import { AlgorithmStep } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { ShortestPathAlgorithm, ShortestPathConfig, ShortestPathResult } from './ShortestPathAlgorithm';

export default class Bellman extends ShortestPathAlgorithm
{
    public get name(): string 
    {
        return "Tìm đường đi ngắn nhất (Thuật toán Bellman-Ford)";
    }

    public override get code(): string 
    {
        return `int pi[MAX_N];
int p[MAX_N];

#define oo 1000000007
void BellmanFord(Graph* G, int s) {
    // Khởi tạo pi[]
    for (int u = 1; u <= G; u++) {
        pi[u] = oo;
    }

    // Khởi tạo pi[s], p[s]
    pi[s] = 0;
    p[s] = -1;

    // Lặp n - 1 lần
    for (int it = 1; it <= G->n; it++) {
        // Duyệt qua các cung và cập nhật nếu có
        for (int k = 0; k <= G->m; k++) {
            u = G->edges[k].u;
            v = G->edges[k].v;
            w = G->edges[k].w;

            // Chưa có đừng đi đến u, bỏ qua cung u, v
            if (pi[u] == oo)
                continue;

            // Nếu đường đi đến v thông qua u ngắn hơn
            if (pi[u] + w < pi[v]) {
                pi[v] = pi[u] + w;
                p[v] = u;
            }
        }
    }
}`;
    }

    protected *_run(g: WeightedGraph, config: ShortestPathConfig, result: ShortestPathResult): IterableIterator<AlgorithmStep> 
    {
        const pi = Array(g.vertexCount + 1).fill(Infinity);
        const p = Array<number>(g.vertexCount + 1).fill(-1);

        const s = config.startVertex;
        const n = g.vertexCount;
        const m = g.edgeCount;
        const edges = g.edges;
        result.startVertex = s;

        yield { log: `BellmanFord(G, ${s})`, codeLine: 5 };

        // highlight các bước khởi tạo
        yield {
            log: `π[1..${n}] = ∞`,
            codeLine: [7, 9],
            backgroundColorVertex: Array.from({ length: n }, (_, i) => [i + 1, 'deepskyblue']) as [number, KEYWORD][],
            contentColorVertex: Array.from({ length: n }, (_, i) => [i + 1, 'white']) as [number, KEYWORD][]
        };
        
        // khởi tạo pi[s]
        pi[s] = 0;
        yield { log: `π[${s}] = 0`, codeLine: 12 };
        yield { log: `p[${s}] = -1`, codeLine: 13 };

        // lặp n - 1 lần duyệt tất cả các cung của đồ thị
        yield { log: `for (int it = 1; it < ${n}; it++)`, codeLine: 16 };
        for (let i = 1; i < n; i++)
        {
            // duyệt qua các cung của đồ thị
            yield { log: `for (int k = 0; k <= ${m}; k++)`, codeLine: 18 };
            for (let k = 0; k < m; k++)
            {
                const u = edges[k].u;
                const v = edges[k].v;
                const w = edges[k].weight;

                yield {
                    log: `(u, v, w) = (${u}, ${v}, ${w})`,
                    codeLine: [19, 21],
                    highlightEdge: [u, v, true],
                    highlightVertex: [[u, true], [v, true]]
                };

                yield { log: `(π[${u}]=${pi[u] === Infinity ? '∞' : pi[u]}) == ∞ => ${pi[u] == Infinity}`, codeLine: 24 };
                // nếu u chưa được duyệt thì bỏ qua -> u phải được duyệt sau s
                if (pi[u] == Infinity) 
                {
                    yield { log: '', codeLine: 25 };
                }
                else
                {
                    yield { log: `(π[${u}] + w = ${pi[u]} + ${w}) < (π[${v}] = ${pi[v] === Infinity ? '∞' : pi[v]}) => ${pi[u] + w < pi[v]}`, codeLine: 28 };
                    if (pi[u] + w < pi[v]) 
                    {
                        pi[v] = pi[u] + w;
                        yield { log: `π[${v}] = ${pi[u] + w}`, codeLine: 29 };

                        yield { log: `p[${v}] = ${u}`, codeLine: 30, colorEdge: [[p[v], v, 'default'], [u, v, "deepskyblue"]] };
                        p[v] = u;
                    }
                }

                yield {
                    log: `k = ${k + 1}`,
                    codeLine: 32,
                    highlightEdge: [u, v, false],
                    highlightVertex: [[u, false], [v, false]]
                };
            }

            yield { log: `it = ${i + 1}`, codeLine: 33 };
        }

        result.distance = pi;
        yield { log: `Kết thúc thuật toán`, codeLine: 34 };
    }
}
