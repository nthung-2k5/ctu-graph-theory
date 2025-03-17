import { AlgorithmStep } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { ShortestPathAlgorithm, ShortestPathConfig, ShortestPathResult } from './ShortestPathAlgorithm';

export default class Dijkstra extends ShortestPathAlgorithm
{
    public get name(): string 
    {
        return "Tìm đường đi ngắn nhất (Thuật toán Dijkstra)";
    }

    public override get code(): string 
    {
        return `int mark[MAX_N];
int pi[MAX_N];
int p[MAX_N];

#define oo 1000000007
void MooreDijkstra(Graph* G, int s) {
    // Khởi tạo pi[], mark[]
    for (int u = 1; u <= G->n; u++) {
        pi[u] = oo;
        mark[u] = 0;
    }

    // Khởi tạo pi[s], p[s]
    pi[s] = 0;
    p[s] = -1;

    // Lặp n - 1 lần
    for (int it = 1; it < G->n; it++) {
        // Tìm pi[u] min và u chưa được duyệt
        int u = -1;
        int minDist = oo;
        for (int j = 1; j <= G->n; j++) {
            if (!mark[j] && pi[j] < minDist) {
                minDist = pi[j];
                u = j;
            }
        }

        // Đánh đấu u đã duyệt
        mark[u] = 1;

        // Duyệt qua các đỉnh kề v của u và cập nhật pi[v], p[v]
        for (int v = 1; v <= G->n; v++) {
            if (G->W[u][v] != NO_EDGE) {
                if (!mark[v] && pi[u] + G->W[u][v] < pi[v]) {
                    pi[v] = pi[u] + G->W[u][v];
                    p[v] = u;
                }
            }
        }
    }
}`;
    }

    protected *_run(g: WeightedGraph, config: ShortestPathConfig, result: ShortestPathResult): IterableIterator<AlgorithmStep> 
    {
        const s = config.startVertex;
        yield { log: `MooreDijkstra(G, ${s})` };
        result.startVertex = s;

        const n = g.vertexCount;
        const pi = Array(n + 1).fill(Infinity);
        const parent = Array(n + 1).fill(-1);
        const mark = Array(n + 1).fill(false);

        // khai bao bien + khoi tao 3 mảng
        yield { log: `Khởi tạo π[], mark[]`, codeLine: [8, 11] };
        yield { log: `π[1..${n}] = ∞` };
        yield { log: `mark[1..${n}] = 0` };

        // khoi tao cho dinh S
        yield { log: `π[${s}] = 0`, codeLine: 14 };
        yield { log: `p[${s}] = -1`, codeLine: 15 };

        pi[s] = 0;

        yield { log: `for (int it = 1; it < ${n}; it++)`, codeLine: 18 };
        for (let i = 1; i < g.vertexCount; i++) 
        {
            yield { log: "u = -1", codeLine: 20 };
            yield { log: "minDist = ∞", codeLine: 21 };

            let u = -1, minDist = Infinity;

            // Tìm đỉnh u có pi[u] nhỏ nhất và chưa được đánh dấu
            yield { log: `Xét các đỉnh chưa được duyệt`, codeLine: [22, 27] };
            const unmarked = [];
            for (let x = 1; x <= n; x++) 
            {
                if (!mark[x]) 
                {
                    yield { log: `π[${x}] = ${pi[x] === Infinity ? '∞': pi[x]}`, borderColorVertex: [x, "red"] };
                    if (pi[x] < minDist)
                    {
                        minDist = pi[x];
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
            // đánh dấu u đã chọn
            yield { log: `mark[${u}] = 1`, codeLine: 30, backgroundColorVertex: [u, "deepskyblue"], contentColorVertex: [u, "white"] };

            // Cập nhật pi và parent của các đỉnh kề v của u
            for (const { v, weight } of g.neighbors(u)) 
            {
                yield { log: `Xét đỉnh ${v}`, codeLine: [33, 34], highlightVertex: [v, true], highlightEdge: [u, v, true] };
                    
                yield {
                    log: `!(mark[${v}] = ${mark[v] ? 1 : 0}) => ${!mark[v]}, (π[u] + G->W[u][v] = ${pi[u]} + ${weight} = ${pi[u] + weight}) < (π[v] = ${pi[v]}) => ${pi[u] + weight < pi[v]}`,
                    codeLine: 35,
                };
    
                if (!mark[v] && pi[u] + weight < pi[v]) 
                {
                    pi[v] = pi[u] + weight;
                    yield {
                        log: `π[${v}] = ${pi[u] + weight}`,
                        codeLine: 36,
                        backgroundColorVertex: [v, "orange"],
                        contentColorVertex: [v, "white"]
                    };
    
                    yield { log: `p[${v}] = ${u}`, codeLine: 37, colorEdge: [[parent[v], v, 'default'], [u, v, "deepskyblue"]] };
                    parent[v] = u;
                }
    
                yield { log: `Kết thúc xét đỉnh ${v}`, codeLine: 40, highlightVertex: [v, false], highlightEdge: [u, v, false] };
            }
    
            yield {
                log: `Kết thúc duyệt đỉnh ${u}, it = ${i + 1}`,
                codeLine: 41,
                highlightVertex: [u, false],
                borderColorVertex: [u, 'default']
            };
        }

        yield { log: `Kết thúc thuật toán`, codeLine: 42 };

        result.distance = pi;
    }
}
