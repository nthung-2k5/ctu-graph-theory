import { ReactNode } from "react";
import { WeightedGraphAlgorithm, AlgorithmStep } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { Form, InputNumber } from "antd";
import store from "../../context/store";
import { KEYWORD } from "color-convert/conversions";

interface DijkstraConfig {
    startVertex: number;
}

export default class Dijkstra extends WeightedGraphAlgorithm<DijkstraConfig, number[]> {
    override _initResult(): number[] {
        return [];
    }

    protected override _result(result: number[]): ReactNode {
        const { startVertex } = this.defaultConfig(); // Lấy đỉnh bắt đầu từ cấu hình mặc định
        console.log(result);
        return (
            <div>
                <h3>Kết quả Dijkstra</h3>
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
    public override defaultConfig(): DijkstraConfig {
        return {
            startVertex: 1,
        };
    }

    public get name(): string {
        return "Thuật toán Dijkstra";
    }

    public override get code(): string {
        return `    int mark[MAX_N];
    int pi[MAX_N];
    int p[MAX_N];
    void MooreDijkstra(Graph* G, int s) {
        int u, v, it;
        //Khoi tao pi[], mark[]
        for (u=1; u<=pG->n; u++)
        {
            pi[u] = oo;
            mark[u] = 0;
        }
        // Khởi tạo pi[s], p[s]
        pi[s] = 0;
        p[s] = -1;
        //Lặp n-1 lần
        for (it = 1; it < pG->n; it++)
        {
            // tìm pi[u] min và u chưa được duyệt
            int j, min_pi = oo;
            for (j=1; j<=pG->n; j++)
                if (mark[j] == 0 && pi[j] < min_pi)
                {
                    min_pi = pi[j];
                    u = j;
                }
            // đánh đấu u đã duyệt
            mark[u] = 1;
            // duyệt qua các đỉnh kề v của u và cập nhật pi[v], p[v]
            for (v=1; v<=pG->n; v++)
                if (pG->W[u][v] != NO_EDGE && mark[v] == 0) 
                {
                    pi[v] = pi[u] + pG->W[u][v];
                    p[v] = u;
                }
        }
      }
      `;
    }

    private trade(p: number[], start: number, end: number): Array<[number, number, KEYWORD]> {
        const colorEdges: Array<[number, number, KEYWORD]> = [];
        let v = end;
        while (v !== start) {
            if (p[v] === -1 || p[v] === end) {
                return colorEdges;
            }
            colorEdges.push([p[v], v, "brown"]); // Tô màu cạnh trên đường đi mới
            v = p[v];
        }
        return colorEdges;
    }

    protected *_run(g: WeightedGraph, config: DijkstraConfig, _result: number[]): IterableIterator<AlgorithmStep> {
        const pi = Array(g.vertexCount + 1).fill(Infinity);
        const p = Array(g.vertexCount + 1).fill(-1);
        const mark = Array(g.vertexCount + 1).fill(false);
        // khai bao bien + khoi tao 3 mảng
        yield { log: ``, codeLine: 5 };
        yield { log: "", codeLine: 7 };
        yield { log: `${pi}`, codeLine: 9 };
        yield { log: `${mark}`, codeLine: 10 };
        const s = config.startVertex;

        // khoi tao cho dinh S
        yield { log: `Khởi tạo: pi[${s}]=0, p[${s}]=-1 `, codeLine: 13 };
        yield { log: "", codeLine: 14 };

        pi[s] = 0;

        yield { log: "", codeLine: 16 };
        for (let i = 1; i < g.vertexCount; i++) {
            yield { log: `Lần lặp: ${i}`, codeLine: 18 };
            yield { log: "", codeLine: 19 };
            yield { log: "", codeLine: 20 };
            yield { log: "", codeLine: 21 };
            yield { log: "", codeLine: 23 };
            yield { log: "", codeLine: 24 };

            let u = -1;
            let min_pi = Infinity;
            for (let j = 1; j <= g.vertexCount; j++) {
                if (pi[j] < min_pi && !mark[j]) {
                    min_pi = pi[j];
                    u = j;
                }
            }
            //trả về đỉnh u và pi[u]
            yield { log: `u=${u}, pi[u]=${pi[u]}` };
            if (u === -1) break;

            mark[u] = true;
            // đánh dấu u đã chọn
            yield {
                log: ` mark[${u}]=true`,
                codeLine: 27,
                colorVertex: [u, "green"],
                highlightVertex: [u, true],
            };

            for (const { v, weight } of g.neighbors(u)) {
                yield {
                    log: `v=${v}`,
                    codeLine: 29,
                    colorVertex: [v, "orange"],
                    colorEdge: [u, v, "orange"],
                };

                yield {
                    log: `mark[v]=${mark[v]}, pi[${u}]=${pi[u]}, weight=${weight}, pi[${v}]=${pi[v]}`,
                    codeLine: 29,
                };
                yield { log: `${pi[u]} + ${weight} < ${pi[v]} == ${pi[u] + weight < pi[v]}`, codeLine: 30 };
                if (!mark[v] && pi[u] + weight < pi[v]) {
                    pi[v] = pi[u] + weight;
                    p[v] = u;
                    yield {
                        log: `pi[${v}]=${pi[u] + weight}`,
                        codeLine: 32,
                        colorVertex: [v, "blue"],
                        colorEdge: [u, v, "blue"],
                    }; // danh dau cap nhat lai pi[v]
                    const colorEdges = this.trade(p, s, v);
                    if (colorEdges.length > 0) {
                        const colorEdgesCopy = colorEdges.map(([u, v, color]) => [u, v, color]);
                        yield {
                            log: ``,
                            colorEdge: colorEdgesCopy as Array<[number, number, KEYWORD]>,
                            colorVertex: [s, "red"],
                        };

                        // Xóa màu sau khi hiển thị đường đi
                        for (let i = 0; i < colorEdges.length; i++)
                            if (colorEdges[i][0] == u && colorEdges[i][1] == v) {
                                colorEdges[i][2] = "orange";
                            } else {
                                colorEdges[i][2] = "black";
                            }
                        yield { log: ``, colorEdge: colorEdges, colorVertex: [s, "gray"] };
                    }

                    yield { log: `p[${v}]=${u}`, codeLine: 33 };
                }
            }

            const edges: Array<[number, number, KEYWORD]> = [];
            const vertices: Array<[number, KEYWORD]> = [];
            for (const { v } of g.neighbors(u)) {
                edges.push([u, v, "black"]);
                if (mark[v]) vertices.push([v, "gray"]);
                else vertices.push([v, "white"]);
            }
            // tắt màu các đỉnh và các cạnh kề của u
            if (vertices.length > 0) {
                yield {
                    log: "",
                    colorEdge: edges,
                    colorVertex: vertices,
                };
            }

            yield { log: "", colorVertex: [u, "gray"] }; // danh dau dinh u da duyet
        }

        //  vẽ đường đi ngắn nhắn từ s đến các đỉnh còn lại
        const edges: Array<[number, number, KEYWORD]> = [];
        const vertexs: Array<[number, KEYWORD]> = [];
        vertexs.push([s, "blue"]);
        for (let u = 1; u <= g.vertexCount; u++)
            if (u != s) {
                edges.push([p[u], u, "red"]);
                vertexs.push([u, "blue"]);
            }
        _result = pi;
        yield { log: ``, codeLine: 36, colorVertex: vertexs, colorEdge: edges };
    }

    public override configNode(): ReactNode {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<DijkstraConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
            </>
        );
    }
}
