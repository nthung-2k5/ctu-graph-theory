import { Form, InputNumber } from "antd";
import store from "../../context/store";
import { PseudocodeLine } from "../../pseudocode/Pseudocode";
import { WeightedGraphAlgorithm, AlgorithmStep } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { KEYWORD } from "color-convert/conversions";
import { ReactNode } from "react";

interface BellmanConfig {
    startVertex: number;
    endVertex: number;
}

export default class Bellman extends WeightedGraphAlgorithm<BellmanConfig> {
    public get name(): string {
        return "Thuật toán Bellman-Ford";
    }

    public override get pseudocode(): PseudocodeLine[] {
        return [
            { text: " Khởi tạo", tab: 0 },
            { text: "pi[u]=oo với mọi u != s;", tab: 1 },
            { text: "pi[s]=0, p[s]=-1", tab: 1 },
            { text: "Lặp n-1 lần", tab: 0 },
            { text: "for(it : 1 -> n-1)", tab: 1 },
            { text: "Duyệt qua các cung và cập nhật pi", tab: 1 },
            { text: "for (k: 0 -> m-1)", tab: 2 },
            { text: "if( pi[u] == oo) // chưa có đường đi đến u ", tab: 3 },
            { text: "continue; // bỏ qua", tab: 4 },
            { text: "if(pi[u] + w < pi[v]", tab: 3 },
            { text: "cập nhật pi[v]=pi[u] +w, p[v] = u", tab: 3 },
            { text: "Kiểm tra chu trình âm", tab: 0 },
            { text: "Tồn tại chu trình âm", tab: 1 },
        ];
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

    protected *_run(g: WeightedGraph, config: BellmanConfig): IterableIterator<AlgorithmStep> {
        const pi = Array(g.vertexCount + 1).fill(Infinity);
        const p = Array<number>(g.vertexCount + 1).fill(-1);

        const s = config.startVertex;
        const n = g.vertexCount;
        const m = g.edgeCount;
        const edges = g.edges;

        //highlight các bước khởi tạo
        yield { codeLine: 0 };
        yield { codeLine: 1 };
        yield { codeLine: 2 };
        //khởi tạo pi[s]
        pi[s] = 0;

        yield { codeLine: 3 };
        // lặp n-1 lần duyệt tất cả các cung của đồ thị
        for (let i = 1; i < n; i++) {
            yield { codeLine: 4 };
            //duyệt qua các cung của đồ thị
            for (let k = 0; k < m; k++) {
                yield { codeLine: 5 };

                const u = edges[k].u;
                const v = edges[k].v;
                const w = edges[k].weight;

                const vertices: Array<[number, KEYWORD]> = [];
                vertices.push([u, "blue"]);
                vertices.push([v, "blue"]);
                //tô màu(xanh dương) cung và cặp đỉnh u-v  đang xét
                yield {
                    codeLine: 6,
                    colorEdge: [u, v, "blue"],
                    colorVertex: vertices,
                };

                yield { codeLine: 7 };
                // nếu u chưa được duyệt thì bỏ qua -> u phải được duyệt sau s
                if (pi[u] == Infinity) {
                    // tô đỏ đỉnh u -> cho thấy u chưa đc duyệt
                    yield {
                        colorVertex: [u, "red"],
                        highlightVertex: [u, true],
                    };

                    yield { codeLine: 8 };
                    //tắt màu cạnh và đỉnh u-v
                    vertices[0][1] = vertices[1][1] = "black";
                    yield {
                        colorEdge: [u, v, "black"],
                        colorVertex: vertices,
                        highlightVertex: [u, false],
                    };
                    // bỏ qua
                    continue;
                }

                yield { codeLine: 9 };
                let haveWay = false;
                // nếu đường đi qua u ngắn hơn
                if (pi[u] + w < pi[v]) {
                    // tô màu xanh cho cung và đỉnh u-v để biểu thị cập nhật
                    vertices[1][1] = vertices[0][1] = "green";
                    yield {
                        codeLine: 10,
                        colorEdge: [u, v, "green"],
                        colorVertex: vertices,
                    };
                    //cập nhật lại pi[v] và p[v]
                    pi[v] = pi[u] + w;
                    p[v] = u;
                    //tô màu đường đi mới và đỉnh s
                    const colorEdges = this.trade(p, s, v);
                    if (colorEdges.length > 0) {
                        haveWay = true;
                        yield { colorEdge: colorEdges, colorVertex: [s, "red"] };
                        //tắt màu đừng đi, đỉnh s và u-v
                        vertices[0][1] = vertices[1][1] = "black";
                        vertices.push([s, "black"]);
                        for (let i = 0; i < colorEdges.length; i++) {
                            colorEdges[i][2] = "black";
                        }
                        yield { colorEdge: colorEdges, colorVertex: vertices };
                    }
                }
                if (!haveWay) {
                    //tắt màu cung và đỉnh u-v
                    vertices[0][1] = vertices[1][1] = "black";
                    yield { colorEdge: [u, v, "black"], colorVertex: vertices };
                }
            }
        }
        yield { codeLine: 11 };
        yield { codeLine: 12 };
    }

    public override configNode(): ReactNode {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<BellmanConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
                <Form.Item<BellmanConfig> label="Đỉnh kết thúc" name="endVertex" initialValue={1}>
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
            </>
        );
    }
}
