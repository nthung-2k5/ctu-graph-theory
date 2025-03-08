import { ReactNode } from "react";
import { WeightedGraphAlgorithm, AlgorithmStep } from "../GraphAlgorithm";
import { WeightedGraph } from "../WeightedGraph";
import { Form, InputNumber } from "antd";
import store from "../../context/store";
import { KEYWORD } from "color-convert/conversions";
import { PseudocodeLine } from "../../pseudocode/Pseudocode";
interface DijkstraConfig {
  startVertex: number;
}

export default class Dijkstra extends WeightedGraphAlgorithm<DijkstraConfig> {
  public get name(): string {
    return "Thuật toán Dijkstra";
  }
  public override get pseudocode(): PseudocodeLine[] {
    return [
      { text: "khởi tạo ", tab: 0 },
      { text: "pi[u]=oo với mội u != s;", tab: 1 },
      { text: "mark[k]=false với mọi u", tab: 1 },
      { text: "pi[s]=0", tab: 1 },
      { text: "Lặp (n-1) lần ", tab: 0 },
      { text: "(1)chọn u chưa đánh dấu, có pi[u] nhỏ nhất", tab: 1 },
      { text: "(2)cập nhật pi[] các đỉnh kề của u", tab: 1, comment: true },
      { text: "for (đỉnh v kề với u)", tab: 1 },
      { text: "if (v chưa duyệt, pi[v] < w[u][v] + pi[u])", tab: 2 },
      { text: "cập nhật \n pi[v]=w[u][v] + p[u], p[v]=u", tab: 3 },
      { text: "(3)đánh dấu u đã duyệt", tab: 1 },
    ];
  }
  protected *_run(
    g: WeightedGraph,
    config: DijkstraConfig
  ): IterableIterator<AlgorithmStep> {
    const pi = Array(g.vertexCount + 1).fill(Infinity);
    const p = Array(g.vertexCount + 1).fill(-1);
    const mark = Array(g.vertexCount + 1).fill(false);

    const s = config.startVertex;

    pi[s] = 0;
    yield { codeLine: 0 };
    yield { codeLine: 1 };
    yield { codeLine: 2 };
    yield { codeLine: 3 };
    yield { codeLine: 4 };
    for (let i = 1; i < g.vertexCount; i++) {
      let u = -1;
      let min_pi = Infinity;
      for (let j = 1; j <= g.vertexCount; j++)
        if (pi[j] < min_pi && !mark[j]) {
          min_pi = pi[j];
          u = j;
        }

      if (u === -1) break;

      mark[u] = true;
      yield {
        codeLine: 5,
        colorVertex: [u, "green"],
        highlightVertex: [u, true],
      }; // chon dinh u
      yield { codeLine: 6 };

      for (const { v, weight } of g.neighbors(u)) {
        yield {
          codeLine: 7,
          colorVertex: [v, "orange"],
          colorEdge: [u, v, "orange"],
        };

        if (!mark[v] && pi[u] + weight < pi[v]) {
          yield { codeLine: 8 };
          yield {
            codeLine: 9,
            colorVertex: [v, "blue"],
            colorEdge: [u, v, "blue"],
          }; // danh dau cap nhat lai pi[v]

          pi[v] = pi[u] + weight;
          p[v] = u;
        }
      }

      const edges: Array<[number, number, KEYWORD]> = [];
      const vertices: Array<[number, KEYWORD]> = [];
      for (const { v, weight } of g.neighbors(u)) {
        edges.push([u, v, "black"]);
        vertices.push([v, "black"]);
      }

      yield {
        colorEdge: edges,
        colorVertex: vertices,
      };

      yield { codeLine: 10, colorVertex: [u, "gray"] }; // danh dau dinh u da duyet
    }
  }

  public override configNode(): ReactNode {
    const vertexCount = store.getState().graph.vertexCount;
    return (
      <>
        <Form.Item<DijkstraConfig>
          label="Đỉnh bắt đầu"
          name="startVertex"
          initialValue={1}
        >
          <InputNumber min={1} max={vertexCount} />
        </Form.Item>
      </>
    );
  }
}
