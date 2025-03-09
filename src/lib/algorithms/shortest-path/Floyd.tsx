import { Form, InputNumber } from "antd";
import { ReactNode } from "react";
import store from "../../context/store";
import { PseudocodeLine } from "../../pseudocode/Pseudocode";
import { AlgorithmStep, WeightedGraphAlgorithm } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { KEYWORD } from "color-convert/conversions";
interface FloydConfig {
    startVertex: number;
    endVertex: number;
}

export default class Floyd extends WeightedGraphAlgorithm<FloydConfig> {
    public get name(): string {
        return "Thuật toán Floyd-Warshall";
    }

    public override get pseudocode(): PseudocodeLine[] {
        return [
            { text: "Khởi tạo", tab: 0 },
            { text: "pi[u][v]=oo với mọi u,v", tab: 1 },
            { text: "pi[u][u]=0 với mọi u", tab: 1 },
            { text: "pi[u][v]=w[u][v] với mọi cung (u,v) của đồ thị", tab: 1 },
            { text: "next[u][v]=v với mọi cung (u,v) của đồ thị", tab: 1 },
            {
                text: "Thực hiện các bước lặp cập nhật pi[u][v]",
                tab: 0,
                comment: true,
            },
            { text: "for(k: 1 -> n)", tab: 1 },
            { text: "for(u: 1 -> n)", tab: 2 },
            { text: "for(v: 1 -> n)", tab: 3 },
            {
                text: "if( pi[u][v] > pi[u][k] + pi[k][v] && giữa u-k và k-v tồn tại đường đi)",
                tab: 4,
            },
            { text: "cập nhật pi[u][v], next[u][v]", tab: 4, comment: true },
            { text: "pi[u][v] = pi[u][k] + pi[k][v]", tab: 5 },
            { text: "next[u][v] = next[u][k]", tab: 5 },
            { text: "Kiểm tra chu trình âm", tab: 0, comment: true },
            { text: "Tồn tại chu trình âm", tab: 1 },
        ];
    }

    private trade(next: number[][], u: number, v: number, k: number): Array<[number, number, KEYWORD]> {
        const edges: Array<[number, number, KEYWORD]> = [];
        do {
            if (next[u][v] == 0) {
                next[u][v] = k;
            }
            edges.push([u, next[u][v], "red"]);
            u = next[u][v];
        } while (u != v && u != 0);

        return edges;
    }

    protected *_run(g: WeightedGraph, config: FloydConfig): IterableIterator<AlgorithmStep> {
        const n = g.vertexCount;

        const pi: number[][] = [];
        const next: number[][] = [];

        for (let i = 0; i < n + 1; i++) {
            pi[i] = new Array(n + 1).fill(Infinity);
            next[i] = new Array(n + 1).fill(0);
        }

        for (let u = 1; u <= n; u++) pi[u][u] = 0;

        const edges = g.edges;
        for (let i = 0; i < g.edgeCount; i++) {
            const e = edges[i];
            pi[e.u][e.v] = e.weight;
            next[e.u][e.v] = e.v;
        }

        yield { codeLine: 0 };
        yield { codeLine: 1 };
        yield { codeLine: 2 };
        yield { codeLine: 3 };
        yield { codeLine: 4 };
        yield { codeLine: 5 };
        var color: KEYWORD;
        var checkNegativeCycle = false;
        for (let k = 1; k <= n && !checkNegativeCycle; k++) {
            yield {
                codeLine: 6,
                colorVertex: [k, "green"],
                highlightVertex: [k, true],
            };
            for (let u = 1; u <= n && !checkNegativeCycle; u++) {
                yield {
                    codeLine: 7,
                    colorVertex: [u, "blue"],
                    highlightVertex: [u, true],
                };
                for (let v = 1; v <= n && !checkNegativeCycle; v++) {
                    yield {
                        codeLine: 8,
                        colorVertex: [v, "orange"],
                        highlightVertex: [v, true],
                    };
                    yield { codeLine: 9 };
                    if (pi[u][v] > pi[u][k] + pi[k][v] && pi[u][k] != Infinity && pi[k][v] != Infinity) {
                        yield { codeLine: 10 };
                        pi[u][v] = pi[u][k] + pi[k][v];
                        yield { codeLine: 11 };
                        next[u][v] = next[u][k];
                        yield { codeLine: 12 };

                        if (pi[u][u] > 0 && pi[v][v] > 0) {
                            const colorEdges = this.trade(next, u, v, k);
                            yield { colorEdge: colorEdges };
                            for (let i = 0; i < colorEdges.length; i++) {
                                colorEdges[i][2] = "black";
                            }
                            yield { colorEdge: colorEdges };
                        } else {
                            checkNegativeCycle = true;
                        }
                    }
                    if (v === u) {
                        color = "blue";
                    } else if (v === k) {
                        color = "green";
                    } else {
                        color = "black";
                    }
                    yield {
                        colorVertex: [v, color],
                        highlightVertex: [v, false],
                    };
                }
                if (u === k) {
                    color = "green";
                } else {
                    color = "black";
                }
                yield { colorVertex: [u, color], highlightVertex: [u, false] };
            }
            yield { colorVertex: [k, "black"], highlightVertex: [k, false] };
        }

        yield { codeLine: 13 };

        if (checkNegativeCycle) {
            yield { codeLine: 14 };
            const vertices: Array<[number, KEYWORD]> = [];
            for (let u = 1; u <= n; u++) {
                vertices.push([u, "red"]);
            }
            yield { colorVertex: vertices };
        } else {
            const s = config.startVertex;
            const f = config.endVertex;
            const colorEdges = this.trade(next, s, f, 0);
            yield { colorEdge: colorEdges };
        }
    }

    public override configNode(): ReactNode {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<FloydConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
                <Form.Item<FloydConfig> label="Đỉnh kết thúc" name="endVertex" initialValue={1}>
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
            </>
        );
    }
}
