import { ReactNode } from "react";
import { AlgorithmStep, WeightedGraphAlgorithm } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { KEYWORD } from "color-convert/conversions";


export default class Floyd extends WeightedGraphAlgorithm<object, number[]> 
{
    protected override _initResult(): number[] 
    {
        return [];
    }

    public override defaultConfig(): object 
    {
        return {};
    }

    protected override _result(result: number[]): ReactNode 
    {
        console.log(result);
        return (
            <div>
                <h3>Kết quả Floyd-warshall</h3>
                <p>Độ dài đường đi từ đỉnh {startVertex} đến:</p>
                <ul>
                    {result.map((dist, index) => (
                        <li key={index}>
                            Đỉnh {index}: {dist === Infinity ? "∞" : dist}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    public get name(): string 
    {
        return "Tìm đường đi ngắn nhất (Thuật toán Floyd-Warshall)";
    }

    public override get code(): string 
    {
        return `
int pi[MAX_N][MAX_N];
int next[MAX_N][MAX_N];

void FloydWarshall(Graph* G)
{
    //Khởi tạo pi[][], next[][]
    int u, v, k;
    for (u=1; u<=G->n; u++)
        for (v=1; v<=G->n; v++)
        { 
            pi[u][v] = oo;
            next[u][v] = -1;
        }
    //đường đi từ u->u = 0
    for (u=1; u<=G->n; u++)
        pi[u][u] = 0;
    //Khởi tạo các đường đi trực tiếp
    for (u=1; u<=G->n; u++)
        for (v=1; v<=G->n; v++)
            if (G->W[u][v] != NO_EDGE)
            {
                pi[u][v] = G->W[u][v];//đi trực tiếp từ u->v
                next[u][v] = v;
            }
    // nếu đường đi từ u->v thông qua k cho chi phí thấp hơn 
    // và từ có đường đi từ u->k, k->v
    // -> cập nhật lại đường đi
    for (k=1; k<=G->n; k++)
        for (u=1; u<=G->n; u++)
            for (v=1; v<=G->n; v++)
                if (pi[u][k] + pi[k][v] < pi[u][v] && pi[u][k]!=oo && pi[k][v]!=oo)
                {
                    pi[u][k] = pi[u][k] + pi[k][v];
                    next[u][v] = next[u][k];
                }

    //kiểm tra chu trình âm
    int negative_cycle = 0;
    for (u=1; u<=G->n; u++)
        if (pi[u][u] < 0)
        {
            negative_cycle = 1;
            break;
        }
}
        `;
    }

    private trade(next: number[][], u: number, v: number, k: number, color: KEYWORD): Array<[number, number, KEYWORD]> 
    {
        const edges: Array<[number, number, KEYWORD]> = [];
        while (u != k && u != 0) 
        {
            edges.push([u, next[u][k], color]);
            u = next[u][k];
        }

        while (u != v && u != 0) 
        {
            edges.push([u, next[u][v], color]);
            u = next[u][v];
        }

        return edges;
    }

    protected *_run(g: WeightedGraph, _config: object, result: number[]): IterableIterator<AlgorithmStep> 
    {
        const n = g.vertexCount;

        const pi: number[][] = [];
        const next: number[][] = [];
        for (let i = 0; i < n + 1; i++) 
        {
            pi[i] = new Array(n + 1).fill(Infinity);
            next[i] = new Array(n + 1).fill(0);
        }

        for (let u = 1; u <= n; u++) pi[u][u] = 0;

        const edges = g.edges;
        for (let i = 0; i < g.edgeCount; i++) 
        {
            const e = edges[i];
            pi[e.u][e.v] = e.weight;
            next[e.u][e.v] = e.v;
        }
        //khoi tao
        yield { log: ``, codeLine: 9 };
        yield { log: ``, codeLine: 10 };
        yield { log: `${pi}`, codeLine: 12 }; //
        yield { log: `${next}`, codeLine: 13 }; //
        yield { log: ``, codeLine: 16 };
        yield { log: `${pi}`, codeLine: 17 }; //
        yield { log: ``, codeLine: 19 };
        yield { log: ``, codeLine: 20 };
        yield { log: ``, codeLine: 21 };
        yield { log: `${pi}`, codeLine: 23 }; //
        yield { log: `${next}`, codeLine: 24 }; //

        let color: KEYWORD;
        let checkNegativeCycle = false;
        for (let k = 1; k <= n && !checkNegativeCycle; k++) 
        {
            //tô màu đỉnh k
            yield {
                log: `k = ${k}`,
                codeLine: 29,
                colorVertex: [k, "green"],
                highlightVertex: [k, true],
            };

            for (let u = 1; u <= n && !checkNegativeCycle; u++) 
            {
                //tô màu đỉnh u
                yield {
                    log: `u=${u}`,
                    codeLine: 30,
                    colorVertex: [u, "blue"],
                    highlightVertex: [u, true],
                };
                for (let v = 1; v <= n && !checkNegativeCycle; v++) 
                {
                    //tô màu đỉnh v
                    yield {
                        log: `k=${k}, u=${u}, v=${v}`,
                        codeLine: 31,
                        colorVertex: [v, "orange"],
                        highlightVertex: [v, true],
                    };
                    yield {
                        log: `pi[${u}][${v}]=${pi[u][v]}, pi[${u}][${k}]=${pi[u][k]}, pi[${u}][${v}]=${pi[k][v]}`,
                        codeLine: 32,
                    };

                    if (pi[u][v] > pi[u][k] + pi[k][v] && pi[u][k] != Infinity && pi[k][v] != Infinity) 
                    {
                        let colorEdges: Array<[number, number, KEYWORD]> = [];
                        pi[u][v] = pi[u][k] + pi[k][v];
                        next[u][v] = next[u][k];

                        if (pi[u][u] >= 0 && pi[v][v] >= 0) 
                        {
                            colorEdges = this.trade(next, u, v, k, "brown");
                            const colorEdgesCopy = colorEdges.map(([u, v, color]) => [u, v, color]);
                            yield {
                                log: ``,
                                colorEdge: colorEdgesCopy as Array<[number, number, KEYWORD]>,
                            };
                        }
                        else checkNegativeCycle = true;

                        yield { log: `pi[${u}][${v}]=${pi[u][v]}`, codeLine: 34 };
                        yield { log: `next[${u}][${v}]=${next[u][k]}`, codeLine: 35 };

                        if (!checkNegativeCycle) 
                        {
                            for (let i = 0; i < colorEdges.length; i++) 
                            {
                                colorEdges[i][2] = "black";
                            }
                            yield { log: ``, colorEdge: colorEdges };
                        }
                    }
                    if (v === u) 
                    {
                        color = "blue";
                    }
                    else if (v === k) 
                    {
                        color = "green";
                    }
                    else 
                    {
                        color = "white";
                    }
                    yield { log: ``, colorVertex: [v, color], highlightVertex: [v, false] };
                }
                if (u === k) 
                {
                    color = "green";
                }
                else 
                {
                    color = "white";
                }
                yield { log: ``, colorVertex: [u, color], highlightVertex: [u, false] };
            }
            yield { log: ``, colorVertex: [k, "white"], highlightVertex: [k, false] };
        }

        yield { log: ``, codeLine: 39 };
        yield { log: ``, codeLine: 40 };
        yield { log: ``, codeLine: 41 };

        for (let u = 1; u <= n; u++)
            if (pi[u][u] < 0) 
            {
                const vertices: Array<[number, KEYWORD]> = [];
                for (let v = 1; v <= n; v++) vertices.push([v, "red"]);
                yield { log: `Tồn tại chu trình âm pi[${u}][${u}]=${pi[u][u]}`, codeLine: 43, colorVertex: vertices };
                yield { log: ``, codeLine: 44 };
                checkNegativeCycle = true;

                break;
            }

        if (!checkNegativeCycle) 
        {
            const s = config.startVertex;
            const vertices: Array<[number, KEYWORD]> = [];
            let edges: Array<[number, number, KEYWORD]> = [];

            for (let u = 1; u <= n; u++) 
            {
                vertices.push([u, "blue"]);
                if (u != s) edges = edges.concat(this.trade(next, s, u, 1, "red"));
            }

            yield { log: `Không tồn tại chu trình âm`, colorVertex: vertices, colorEdge: edges };
        }

        for (let u = 1; u <= n; u++) result[u] = pi[config.startVertex][u];

        yield { log: ``, codeLine: 46 };
    }

    public override configNode(): ReactNode 
    {
        return (<></>);
    }
}
