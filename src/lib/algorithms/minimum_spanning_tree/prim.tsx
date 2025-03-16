import { ReactNode, useEffect, useRef } from "react";
import { AlgorithmRequirements, AlgorithmStep, WeightedGraphAlgorithm } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { Form, InputNumber } from "antd";
import store from "../../context/store";
import cytoscape from "cytoscape";
import { KEYWORD } from "color-convert/conversions";
import { TreeMultiMap } from "data-structure-typed";

export interface PrimConfig {
    startVertex: number;
}

interface PrimResult {
    // Lưu cây khung bằng TreeMap vì map nó sắp xếp tăng dần theo key sẵn.
    // Tụi mình đỡ sort
    // TreeMultiMap<number1, [number2, number3]>
    // number1: đỉnh u, number2: đỉnh v, number3: trọng số
    prim: TreeMultiMap<number, [number, number]>;
    totalTree: number;
}

export default class Prim extends WeightedGraphAlgorithm<PrimConfig, PrimResult> {
    protected override _initResult(): PrimResult {
        return {
            prim: new TreeMultiMap<number, [number, number]>(),
            totalTree: 0,
        };
    }

    // protected override _result(result: PrimResult): ReactNode {
    //     const cyRef = useRef<HTMLDivElement>(null);

    //     useEffect(() => {
    //         if (!cyRef.current) return;

    //         const prim: Map<number, [number, number]> = result.prim;
    //         const elements: cytoscape.ElementDefinition[] = [];
    //         const nodes = new Set<number>();

    //         for (const [source, [target, weight]] of prim.entries()) {
    //             nodes.add(source);
    //             nodes.add(target);
    //             elements.push({
    //                 data: {
    //                     id: `${source}-${target}`,
    //                     source: `${source}`,
    //                     target: `${target}`,
    //                     label: `${weight}`,
    //                 },
    //             });
    //         }

    //         nodes.forEach((node) => {
    //             elements.push({ data: { id: `${node}` } });
    //         });

    //         const cy = cytoscape({
    //             container: cyRef.current,
    //             elements: elements,
    //             style: [
    //                 {
    //                     selector: "node",
    //                     style: {
    //                         label: "data(id)",
    //                         "background-color": "#ffffff",
    //                         "text-valign": "center",
    //                         "text-halign": "center",
    //                         color: "#000000",
    //                         "border-width": 2,
    //                         "border-color": "#000000",
    //                         width: 40,
    //                         height: 40,
    //                         "font-size": "18px",
    //                     },
    //                 },
    //                 {
    //                     selector: "edge",
    //                     style: {
    //                         label: "data(label)",
    //                         "curve-style": "bezier",
    //                         "target-arrow-shape": "none",
    //                         "line-color": "#000000",
    //                         "text-background-color": "#ffffff",
    //                         "text-background-opacity": 1,
    //                         "text-background-padding": "3px",
    //                         "font-size": "18px",
    //                         width: 2,
    //                     },
    //                 },
    //             ],
    //             layout: { name: "circle" },
    //         });

    //         return () => cy.destroy(); // cleanup
    //     }, [result.prim]); // Chỉ chạy lại khi có kết quả mới

    //     return (
    //         <>
    //             {[...result.prim].map(([key, value]) => (
    //                 <div key={key}>
    //                     <p>
    //                         {key} - {value[0]} (trọng số: {value[1]})
    //                     </p>
    //                 </div>
    //             ))}
    //             <p>Tổng trọng số cây khung nhỏ nhất: {result.totalTree}</p>

    //             {/* div chứa cây khung */}
    //             <div
    //                 ref={cyRef}
    //                 style={{
    //                     width: "100%",
    //                     height: "300px",
    //                     border: "1px solid white",
    //                     borderRadius: "10px",
    //                 }}
    //             />
    //         </>
    //     );
    // }
    // xong
    protected override _result(result: PrimResult): ReactNode {
        const cyRef = useRef<HTMLDivElement>(null);

        console.log(result.prim);

        useEffect(() => {
            if (!cyRef.current) return;

            const kruskal: TreeMultiMap<number, [number, number]> = result.prim;
            const elements: cytoscape.ElementDefinition[] = [];
            const nodes = new Set<number>();

            for (const [source, values] of kruskal.entries()) {
                if (!values) continue; // Kiểm tra nếu giá trị là undefined (tránh lỗi)

                for (const [target, weight] of values) {
                    nodes.add(source);
                    nodes.add(target);
                    elements.push({
                        data: {
                            id: `${source}-${target}`,
                            source: `${source}`,
                            target: `${target}`,
                            label: `${weight}`,
                        },
                    });
                }
            }

            nodes.forEach((node) => {
                elements.push({ data: { id: `${node}` } });
            });

            const cy = cytoscape({
                container: cyRef.current,
                elements: elements,
                style: [
                    {
                        selector: "node",
                        style: {
                            label: "data(id)",
                            "background-color": "#ffffff",
                            "text-valign": "center",
                            "text-halign": "center",
                            color: "#000000",
                            "border-width": 2,
                            "border-color": "#000000",
                            width: 40,
                            height: 40,
                            "font-size": "18px",
                            // "font-weight": 600
                        },
                    },
                    {
                        selector: "edge",
                        style: {
                            label: "data(label)",
                            "curve-style": "bezier",
                            "target-arrow-shape": "none",
                            "line-color": "#000000",
                            "text-background-color": "#ffffff",
                            "text-background-opacity": 1,
                            "text-background-padding": "3px",
                            "font-size": "18px",
                            // "font-weight": 600,
                            width: 2,
                        },
                    },
                ],
                layout: { name: "circle" },
            });

            return () => cy.destroy(); // cleanup
        }, [result.prim]); // Chỉ chạy lại khi có kết quả mới

        return (
            <>
                {[...result.prim].map(([key, values]) => (
                    <div key={key}>
                        {(values || []).map((value, index) => (
                            <p key={index}>
                                {key} - {value[0]} (trọng số: {value[1]})
                            </p>
                        ))}
                    </div>
                ))}
                <p>Tổng trọng số cây khung nhỏ nhất: {result.totalTree}</p>

                {/* div chứa cây khung */}
                <div
                    ref={cyRef}
                    style={{
                        width: "100%",
                        height: "300px",
                        border: "1px solid white",
                        borderRadius: "10px",
                    }}
                />
            </>
        );
    }

    public override defaultConfig(): PrimConfig {
        return {
            startVertex: 1,
        };
    }

    public override get code(): string {
        return `
int p[MAXN];
int mark[MAXN];
int dist[MAXN];
int Prim(Graph *pG, Graph *pT, int s) {
    int i, u, v, x;
  
    // 1. Khởi tạo
    for (u = 1; u <= pG->n; u++) {
        dist[u] = INT_MAX; // Khởi tạo dist[u] = vô cùng
        p[u] = -1; // p[u] chưa xác định
        mark[u] = 0; // Đỉnh chưa được đánh dấu
    }
    dist[s] = 0; // Chỉ có dist[s] = 0

    // 2. Lặp n - 1 lần
    for (i = 1; i < pG->n; i++) {
        // 2a. Tìm u gần với S nhất (tìm u có dist[u] nhỏ nhất)
        int min_dist = INT_MAX;
        for (x = 1; x <= pG->n; x++) {
            if (mark[x] == 0 && dist[x] < min_dist) {
                min_dist = dist[x];
                u = x;
            }
        }
        // 2b. Đánh dấu u
        mark[u] = 1;

        // 2c. Cập nhật lại dist và p của các đỉnh kề v của u
        for (v = 1; v <= pG->n; v++) {
            if (pG->A[u][v] != NO_EDGE && mark[v] == 0 && dist[v] > pG->W[u][v]) {
                dist[v] = pG->W[u][v];
                p[v] = u;
            }
        }
    }

    // 3. Dựng cây dựa vào p[u]: thêm các cung (p[u], u) vào cây T
    init_graph(pT, pG->n); // Khởi tạo cây T rỗng
    int sum_w = 0; // Tổng trọng số của cây T

    for (u = 1; u <= pG->n; u++) {
        if (p[u] != -1) {
            int w = pG->W[p[u]][u];
            add_edge(pT, p[u], u, w);
            sum_w += w;
        }
    }
    return sum_w;
}`;
    }

    public get name(): string {
        return "Thuật toán Prim";
    }

    public override get predicate(): AlgorithmRequirements {
        return {
            directed: false,
            weighted: true,
        };
    }

    public override configNode(): ReactNode {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<PrimConfig> label="Đỉnh bắt đầu" name="startVertex">
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
            </>
        );
    }

    private *_prim(g: WeightedGraph, config: PrimConfig, result: PrimResult): IterableIterator<AlgorithmStep> {
        const n = g.vertexCount;
        const mark = Array<boolean>(n + 1).fill(false);
        const dist = Array<number>(n + 1).fill(Infinity);
        const parent = Array<number>(n + 1).fill(-1);

        const s = config.startVertex;
        dist[config.startVertex] = 0;
        yield { log: `khởi tạo dist[], p[], mark[]`, codeLine: 9 };
        yield { log: `dist[]= ${dist}`, codeLine: 10 };
        yield { log: `p[]= ${parent}`, codeLine: 11 };
        yield { log: `mark[]= ${mark}`, codeLine: 12 };
        yield { log: `khởi tạo dist[${s}]=0`, codeLine: 14 };
        for (let i = 1; i <= n; i++) {
            yield { log: `Lần lặp ${i}`, codeLine: 17 };
            let u = -1;
            let minDist = Infinity;

            // Tìm đỉnh u có dist[u] nhỏ nhất và chưa được đánh dấu
            for (let x = 1; x <= n; x++) {
                if (!mark[x] && dist[x] < minDist) {
                    minDist = dist[x];
                    u = x;
                }
            }
            yield { log: `tìm đỉnh có dist[] nhỏ nhất chưa được duyệt`, codeLine: 19 };
            yield { log: ``, codeLine: 20 };
            yield { log: ``, codeLine: 21 };
            yield { log: ``, codeLine: 22 };
            yield { log: `u=${u}, min_dist=${minDist}`, codeLine: 23, colorVertex: [u, "blue"] };
            if (u === -1) break;

            mark[u] = true;
            yield {
                log: `mark[${u}]=true`,
                codeLine: 27,
            };
            yield { log: `Duyệt qua các đỉnh v kề u  và cập nhật dist[v]` };
            // Cập nhật dist và parent của các đỉnh kề v của u
            for (const { v, weight } of g.neighbors(u)) {
                yield {
                    log: `v=${v}, mark[${v}]=${mark[v]}, dist[v]=${dist[v]}, pG->W[u][v]=${weight} `,
                    codeLine: 30,
                    colorVertex: [v, "orange"],
                    colorEdge: [u, v, "orange"],
                };
                yield {
                    log: `( ${mark[v]} && ${dist[v]} < ${weight} ) = ${mark[v] && dist[v] < weight}  `,
                    codeLine: 31,
                };
                if (!mark[v] && weight < dist[v]) {
                    yield {
                        log: `dist[${v}]=${weight}`,
                        codeLine: 32,
                        colorVertex: [v, "blue"],
                        colorEdge: [u, v, "blue"],
                    };
                    dist[v] = weight;
                    yield { log: `parent[${v}]=${u}`, codeLine: 33 };
                    parent[v] = u;
                    yield { log: ``, colorVertex: [v, "orange"], colorEdge: [u, v, "orange"] };
                }
            }

            const vertices: Array<[number, KEYWORD]> = [];
            const edges: Array<[number, number, KEYWORD]> = [];
            for (const { v } of g.neighbors(u)) {
                if (mark[v]) vertices.push([v, "gray"]);
                else vertices.push([v, "white"]);
                edges.push([u, v, "black"]);
            }

            vertices.push([u, "gray"]);
            yield {
                log: `Đỉnh ${u} được thêm vào cây khung`,
                codeLine: 35,
                colorVertex: vertices,
                colorEdge: edges,
            };
        }

        yield { log: `khởi tạo cây khung ${n} đỉnh`, codeLine: 39 };
        yield { log: `sum=0`, codeLine: 40 };
        // Dựng cây khung từ parent
        const vertices: Array<[number, KEYWORD]> = [];
        const edges: Array<[number, number, KEYWORD]> = [];
        for (let u = 1; u <= n; u++) {
            vertices.push([u, "blue"]);
            if (parent[u] !== -1) {
                edges.push([parent[u], u, "red"]);

                result.prim.add(parent[u], [u, dist[u]]);
                result.totalTree += dist[u];
            }
        }
        yield { log: `Thêm các cạnh vào cây khung và tính tổng trọng số`, codeLine: 42 };
        yield { log: ``, codeLine: 43 };
        yield { log: ``, codeLine: 44 };
        yield { log: ``, codeLine: 45 };
        yield { log: ``, codeLine: 46 };
        yield { log: ``, codeLine: 47 };
        yield { log: ``, codeLine: 48 };
        yield { log: `Trọng số sum=${result.totalTree}`, codeLine: 49, colorEdge: edges, colorVertex: vertices };
    }

    protected override *_run(
        g: WeightedGraph,
        config: PrimConfig,
        result: PrimResult
    ): IterableIterator<AlgorithmStep> {
        yield* this._prim(g, config, result);
    }
}
