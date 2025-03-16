import { ReactNode, useEffect, useRef } from "react";
import { AlgorithmRequirements, AlgorithmStep, WeightedGraphAlgorithm } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { Form, InputNumber } from "antd";
import store from "../../context/store";
import cytoscape from "cytoscape";
import { TreeMultiMap } from "data-structure-typed";
import { KEYWORD } from "color-convert/conversions";

export interface KruskalConfig {
    startVertex: number;
    traverseAll: boolean;
}

interface KruskalResult {
    // Lưu cây khung bằng TreeMap vì map nó sắp xếp tăng dần theo key sẵn.
    // Tụi mình đỡ sort
    // TreeMultiMap<number1, [number2, number3]>
    // number1: đỉnh u, number2: đỉnh v, number3: trọng số
    kruskal: TreeMultiMap<number, [number, number]>;
    totalTree: number;
}

class KruskalContext {
    parent: number[];

    constructor(vertexCount: number) {
        this.parent = Array(vertexCount + 1);
    }
}

export default class Kruskal extends WeightedGraphAlgorithm<KruskalConfig, KruskalResult> {
    // xong
    protected override _initResult(): KruskalResult {
        return {
            kruskal: new TreeMultiMap<number, [number, number]>(),
            totalTree: 0,
        };
    }

    // xong
    protected override _result(result: KruskalResult): ReactNode {
        const cyRef = useRef<HTMLDivElement>(null);

        console.log(result.kruskal);

        useEffect(() => {
            if (!cyRef.current) return;

            const kruskal: TreeMultiMap<number, [number, number]> = result.kruskal;
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
        }, [result.kruskal]); // Chỉ chạy lại khi có kết quả mới

        return (
            <>
                {[...result.kruskal].map(([key, values]) => (
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

    // xong
    public override defaultConfig(): KruskalConfig {
        return {
            startVertex: 1,
            traverseAll: false,
        };
    }

    // xong
    public override get code(): string {
        return `int findRoot(Graph graph, int u) {
    while (u != parent[u])
        u = parent[u];
    return u;
}
int parent[100];
int kruskal(Graph *G, Graph *tree) {
  

    // Sắp xếp cạnh của đồ thị theo thứ tự tăng dần
    for (int i = 0; i < G->m; i++)
        for (int j = i + 1; j < G->m; j++)
            if (G->edges[i].w > G->edges[j].w)
                swap(&G->edges[i], &G->edges[j]);

 
    // Tạo cây khung rỗng
    init_graph(tree, G->n);
    
    //khoi tao weight va parent[]
    int weight = 0;
    for (int i = 1; i <= G->n; i++) 
        parent[i] = i;
        
    //Thêm các cạnh để tạo cây khung nhỏ nhất.
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
    public get name(): string {
        return "Thuật toán Kruskal";
    }

    // xong
    public override get predicate(): AlgorithmRequirements {
        return {
            directed: false, // Đồ thị phải là không có hướng
            weighted: true,
        }; // Điều kiện của đồ thị
    }

    // xong
    public override configNode(): ReactNode {
        const vertexCount = store.getState().graph.vertexCount;
        return (
            <>
                <Form.Item<KruskalConfig> label="Đỉnh bắt đầu" name="startVertex">
                    <InputNumber min={1} max={vertexCount} />
                </Form.Item>
            </>
        );
    }

    private findRoot(ctx: KruskalContext, u: number) {
        while (u != ctx.parent[u]) {
            u = ctx.parent[u];
        }
        return u;
    }

    private *_kruskal(g: WeightedGraph, ctx: KruskalContext, result: KruskalResult): IterableIterator<AlgorithmStep> {
        const p = Array<number>(g.vertexCount + 1).fill(-1);
        // Lấy danh sách cạnh, lưu vào edges rồi sort edges
        const edges = g.edges;
        const m = g.edgeCount;
        const n = g.vertexCount;
        for (let i = 0; i < m; i++) {
            for (let j = i + 1; j < m; j++) {
                if (edges[i].weight > edges[j].weight) {
                    // swap bằng desctructering
                    [edges[i], edges[j]] = [edges[j], edges[i]];
                }
            }
        }

        let s: string = "G.edges: {";
        for (let i = 0; i < m; i++) s += `(${edges[i].u}, ${edges[i].v}, ${edges[i].weight}), `;
        s += "}";
        yield { log: `sắp xếp tăng dần các cung của độ thị`, codeLine: 11 };
        yield { log: ``, codeLine: 12 };
        yield { log: ``, codeLine: 13 };
        yield { log: `${s}`, codeLine: 14 };

        for (let i = 1; i <= g.vertexCount; i++) ctx.parent[i] = i;
        yield { log: `Khởi tạo cây khung kết quả với ${n} đỉnh`, codeLine: 18 };
        yield { log: `Khởi tạo biến weight và mảng parent`, codeLine: 21 };
        yield { log: `weight=0`, codeLine: 22 };
        yield { log: `parent: ${ctx.parent}`, codeLine: 23 };

        for (let i = 0; i < m; i++) {
            yield { log: `Lần lặp i=${i + 1}`, codeLine: 26 };

            let u = edges[i].u;
            let v = edges[i].v;
            let w = edges[i].weight;
            const vertices: Array<[number, KEYWORD]> = [];
            vertices.push([u, "blue"]);
            vertices.push([v, "blue"]);

            yield {
                log: `u=${u}`,
                codeLine: 27,
                colorEdge: [u, v, "blue"],
                colorVertex: vertices.map(([u, keyword]) => [u, keyword]) as Array<[number, KEYWORD]>,
            };
            yield { log: `v=${u}`, codeLine: 28 };
            yield { log: `w=${u}`, codeLine: 29 };

            let rootu = this.findRoot(ctx, u);
            let rootv = this.findRoot(ctx, v);
            yield { log: `root_u=${rootu}`, codeLine: 30 };
            yield { log: `root_v=${rootv}`, codeLine: 31 };
            yield { log: `${rootu} == ${rootv} = ${rootu == rootv}` };
            if (rootu != rootv) {
                vertices[0][1] = vertices[1][1] = "green";
                result.kruskal.add(u, [v, w]);
                yield {
                    log: `thêm cung (${u}, ${v}, ${w}) vào cây`,
                    codeLine: 34,
                    colorEdge: [u, v, "green"],
                    colorVertex: vertices.map(([u, keyword]) => [u, keyword]) as Array<[number, KEYWORD]>,
                };
                result.totalTree += w;
                yield { log: `weight=${result.totalTree}`, codeLine: 35 };
                ctx.parent[rootv] = rootu;
                p[v] = u;
                yield { log: `parent[${rootv}]=${rootu}`, codeLine: 38 };
            }
            vertices[0][1] = vertices[1][1] = "white";
            yield {
                log: ``,
                colorEdge: [u, v, "black"],
                colorVertex: vertices.map(([u, keyword]) => [u, keyword]) as Array<[number, KEYWORD]>,
            };
        }

        const colorVertices: Array<[number, KEYWORD]> = [];
        const colorEdges: Array<[number, number, KEYWORD]> = [];

        for (let u = 1; u <= n; u++) {
            colorVertices.push([u, "blue"]);
            if (u != p[u]) {
                colorEdges.push([p[u], u, "red"]);
            }
        }
        yield { log: ``, codeLine: 40, colorVertex: colorVertices, colorEdge: colorEdges };
    }

    protected override *_run(
        g: WeightedGraph,
        config: KruskalConfig,
        result: KruskalResult
    ): IterableIterator<AlgorithmStep> {
        const ctx = new KruskalContext(g.vertexCount);
        yield* this._kruskal(g, ctx, result);
    }
}
