import { Form, InputNumber } from "antd";
import store from "../../context/store";
// import { PseudocodeLine } from "../../pseudocode/Pseudocode";
import { WeightedGraphAlgorithm, AlgorithmStep } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { KEYWORD } from "color-convert/conversions";
import { ReactNode } from "react";

interface BellmanConfig {
    startVertex: number;
}

export default class Bellman extends WeightedGraphAlgorithm<BellmanConfig, number[]> {
    protected override _initResult(): number[] {
        return [];
    }
    public override defaultConfig(): BellmanConfig {
        return {
            startVertex: 1,
        };
    }
    protected override _result(result: number[]): ReactNode {
        const { startVertex } = this.defaultConfig(); // Lấy đỉnh bắt đầu từ cấu hình mặc định
        console.log(result);
        return (
            <div>
                <h3>Kết quả Bellman-ford</h3>
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
    public get name(): string {
        return "Thuật toán Bellman-Ford";
    }

    public override get code(): string {
        return `
int pi[MAXN];
int p[MAXN];
void BellmanFord(Graph *pG, int s)
{
    //Khởi tạo pi[]
    int u, v, w, it, k;
    for (u=1; u<=pG; u++)
        pi[u] oo;
    // khởi tạo pi[s], p[s]
    pi[s] = 0;
    p[s] = -1;

    // lặp n-1 lần
    for (it=1; it<=pG->n; it++)
    {
        // duyệt qua các cung và cập nhật nếu có
        for (k=0; k<=pG->m; k++)
        {
            u = pG->edges[k].u;
            v = pG->edges[k].v;
            w = pG->edges[k].w;
            // chưa có đừng đi đến u, bỏ qua cung u,v
            if ( pi[u] == oo)
                continue;
            //nếu đường đi đến v thông qua u ngắn hơn
            if (pi[u] + w < pi[v])
            {
                pi[v] = pi[u] + w;
                p[v] = u;
            }
        }
    }

    //Kiểm tra chu trình âm
    int negative_cycle = 0;
    for (k=0; k<G->m; k++)
    {
        u = pG->edges[k].u;
        v = pG->edges[k].v;
        w = pG->edges[k].w;
        //nếu vẫn còn đường đi mới đến v tốt hơn
        if (pi[u] + w < pi[v])
        {
            negative_cycle = 1;// có chu trình âm
            break;
        }
    }
}`;
    }

    private trade(p: number[], start: number, end: number): Array<[number, number, KEYWORD]> {
        const colorEdges: Array<[number, number, KEYWORD]> = [];
        let v = end;
        while (v != start) {
            if (p[v] == -1 || p[v] == end) {
                return colorEdges;
            }
            colorEdges.push([p[v], v, "brown"]);
            v = p[v];
        }

        return colorEdges;
    }

    protected *_run(g: WeightedGraph, config: BellmanConfig, result: number[]): IterableIterator<AlgorithmStep> {
        const pi = Array(g.vertexCount + 1).fill(Infinity);
        const p = Array<number>(g.vertexCount + 1).fill(-1);

        const s = config.startVertex;
        const n = g.vertexCount;
        const m = g.edgeCount;
        const edges = g.edges;

        //khởi tạo pi[s]
        pi[s] = 0;

        //highlight các bước khởi tạo
        yield { log: ``, codeLine: 7 };
        yield { log: ``, codeLine: 8 };
        yield { log: `${pi}`, codeLine: 9 };
        yield { log: `pi[${s}]=0`, codeLine: 11 };
        yield { log: `p[${s}]=-1`, codeLine: 12 };

        // lặp n-1 lần duyệt tất cả các cung của đồ thị
        for (let i = 1; i < n; i++) {
            yield { log: `it=${i}`, codeLine: 15 };
            //duyệt qua các cung của đồ thị
            for (let k = 0; k < m; k++) {
                yield { log: `k=${k}`, codeLine: 18 };

                const u = edges[k].u;
                const v = edges[k].v;
                const w = edges[k].weight;

                //tô màu(xanh dương) cung và cặp đỉnh u-v  đang xét
                const vertices: Array<[number, KEYWORD]> = [];
                vertices.push([u, "blue"]);
                vertices.push([v, "blue"]);

                const verticesCopy = vertices.map(([u, KEYWORD]) => [u, KEYWORD]);

                yield {
                    log: ``,
                    colorEdge: [u, v, "blue"],
                    colorVertex: verticesCopy as Array<[number, KEYWORD]>,
                };
                yield { log: `u=${u}`, codeLine: 20 };
                yield { log: `v=${v}`, codeLine: 21 };
                yield { log: `weight=${w}`, codeLine: 22 };

                yield { log: `pi[${u}]=${pi[u]}`, codeLine: 24 };
                // nếu u chưa được duyệt thì bỏ qua -> u phải được duyệt sau s
                if (pi[u] == Infinity) {
                    // tô đỏ đỉnh u -> cho thấy u chưa đc duyệt
                    yield {
                        log: `u chưa được duyệt`,
                        codeLine: 25,
                        colorVertex: [u, "red"],
                        highlightVertex: [u, true],
                    };

                    //tắt màu cạnh và đỉnh u-v
                    vertices[0][1] = vertices[1][1] = "white";
                    yield { log: ``, colorEdge: [u, v, "black"], colorVertex: vertices, highlightVertex: [u, false] };
                    // bỏ qua
                    continue;
                }

                yield { log: `${pi[u]} + ${w} < ${pi[v]} = ${pi[u] + w < pi[v]}`, codeLine: 27 };
                let haveWay = false;
                // nếu đường đi qua u ngắn hơn
                if (pi[u] + w < pi[v]) {
                    // tô màu xanh cho cung và đỉnh u-v để biểu thị cập nhật
                    vertices[1][1] = vertices[0][1] = "green";
                    const verticesCopy = vertices.map(([number, KEYWORD]) => [number, KEYWORD]);
                    yield {
                        log: `pi[${v}]=${pi[u] + w}`,

                        colorEdge: [u, v, "green"],
                        colorVertex: verticesCopy as Array<[number, KEYWORD]>,
                    };

                    pi[v] = pi[u] + w;
                    p[v] = u;
                    //tô màu đường đi mới và đỉnh s
                    const colorEdges = this.trade(p, s, v);
                    if (colorEdges.length > 0) {
                        haveWay = true;
                        const colorEdgesCopy = colorEdges.map(([u, v, color]) => [u, v, color]);
                        yield {
                            log: ``,
                            codeLine: 29,
                            colorEdge: colorEdgesCopy as Array<[number, number, KEYWORD]>,
                            colorVertex: [s, "red"],
                        };
                        //tắt màu đừng đi, đỉnh s và u-v
                        vertices[0][1] = vertices[1][1] = "white";
                        vertices.push([s, "white"]);
                        for (let i = 0; i < colorEdges.length; i++) {
                            colorEdges[i][2] = "black";
                        }
                        yield { log: `p[${v}]=${u}`, codeLine: 30 };
                        yield { log: ``, colorEdge: colorEdges, colorVertex: vertices };
                    } else yield { log: `p[${v}]=${u}`, codeLine: 30 };
                }

                result = pi;

                if (!haveWay) {
                    //tắt màu cung và đỉnh u-v
                    vertices[0][1] = vertices[1][1] = "white";
                    yield { log: ``, colorEdge: [u, v, "black"], colorVertex: vertices };
                }
            }
        }

        //kiểm tra chu trình âm
        yield { log: ``, codeLine: 36 };
        yield { log: ``, codeLine: 37 };
        yield { log: ``, codeLine: 39 };
        yield { log: ``, codeLine: 40 };
        yield { log: ``, codeLine: 41 };
        yield { log: ``, codeLine: 43 };
        var negative_cycle = false;
        for (let k = 0; k < m; k++) {
            var u = edges[k].u;
            var v = edges[k].v;
            var w = edges[k].weight;

            if (pi[u] + w < pi[v]) {
                negative_cycle = true;
                const vertices: Array<[number, KEYWORD]> = [];
                for (let i = 1; i <= n; i++) vertices.push([i, "red"]);

                yield { log: `Tồn tại chu trình âm`, codeLine: 45, colorVertex: vertices };
                yield { log: ``, codeLine: 46 };

                break;
            }
        }
        //tô màu đồ thị
        if (!negative_cycle) {
            const vertices: Array<[number, KEYWORD]> = [];
            const edges: Array<[number, number, KEYWORD]> = [];
            for (let u = 1; u <= n; u++) {
                vertices.push([u, "blue"]);
                if (u != s) edges.push([p[u], u, "red"]);
            }
            yield { log: `Không tồn tại chu trình âm`, colorVertex: vertices, colorEdge: edges };
        }

        yield { log: ``, codeLine: 49 };
    }

    public override configNode(): ReactNode {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<BellmanConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
            </>
        );
    }
}
