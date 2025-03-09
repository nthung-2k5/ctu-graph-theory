import { ReactNode } from "react";
import { PseudocodeLine } from "../../pseudocode/Pseudocode";
import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from "../GraphAlgorithm";
import { UnweightedGraph } from "../UnweightedGraph";
import Animator from "../../animation/Animator";

export interface TopoOrderingBFSConfig {
   
}

// class TopoOrderingBFSContext {

// }

export default class TopoOrderingBFS extends NeutralGraphAlgorithm<TopoOrderingBFSConfig> {
   public get name(): string {
      return 'Xác định thứ tự Topo';
   }

   public override get pseudocode(): PseudocodeLine[] {
      return [
         { text: 'Tính bậc vào của mỗi đỉnh', tab: 0 },
         { text: 'Khởi tạo hàng đợi Q với các đỉnh có bậc vào = 0', tab: 0 },
         { text: 'while (Q != ∅)', tab: 0 },
         { text: 'u <- Q;', tab: 1 },
         { text: 'Thêm u vào danh sách kết quả', tab: 1 },
         { text: 'for (đỉnh v kề với u)', tab: 1 },
         { text: 'Giảm bậc vào của v đi 1', tab: 2 },
         { text: 'if (bậc vào của v == 0)', tab: 2 },
         { text: 'Q <- v;', tab: 3 },
      ];
   }

   public override get predicate(): AlgorithmRequirements {
      return { 
         directed: true, // Đồ thị phải là có hướng
         weighted: undefined, // Đồ thị phải có trọng số hay không đều được 
         acyclic: true, // Đồ thị không được có chu trình 
      }; // Điều kiện của đồ thị
   }

   private static findRoot(g: UnweightedGraph): object[] {
      let inDegree = new Map<number, number>();
  
      for (let vertex = 1; vertex <= g.vertexCount; vertex++) {
         inDegree.set(vertex, 0);
      }
  
      for (const edge of g.edges) {
         inDegree.set(edge.v, (inDegree.get(edge.v) || 0) + 1);
      }
  
      // Lọc ra các đỉnh có bậc vào bằng 0
      return Array.from(inDegree.entries())
         .filter(([_, degree]) => degree === 0)
         .map(([vertex, _]) => ({ value: vertex.toString(), label: vertex.toString() }));
   }

   public override configNode(): ReactNode {
      // const graph = store.getState().graph as UnweightedGraph;
      // const rootVertices = TopoOrderingBFS.findRoot(graph);
      return (
         <></>
            // <>
            //    <Form.Item<TopoOrderingBFSConfig> label="Đỉnh gốc" name="startVertex" initialValue={1}>
            //       <Space wrap>
            //          <Select
            //             defaultValue={rootVertices[0]}
            //             style={{ width: 120 }}
            //             onChange={() => {console.log(rootVertices)}}
            //             options={rootVertices}
            //          />
            //       </Space>
            //    </Form.Item>
            // </>
      );
   }

   protected override *_run(g: UnweightedGraph, config: TopoOrderingBFSConfig, animator: Animator): IterableIterator<AlgorithmStep> {
      let inDegree = new Map<number, number>();
      let queue: number[] = [];
      let topoOrder: number[] = [];

      // 1. Tính bậc vào cho mỗi tỉnh
      for (let vertex = 1; vertex <= g.vertexCount; vertex++) {
         yield { 
            backgroundColorVertex: [vertex, 'green'],
            codeLine: 0 
         };
         inDegree.set(vertex, 0);
      }
      
      for (const edge of g.edges) {
         inDegree.set(edge.v, (inDegree.get(edge.v) || 0) + 1);
      }
      // Kết thúc 1

      // 2. Đưa các đỉnh có bậc bằng 0 vào hàng 
      for (let vertex = 1; vertex <= g.vertexCount; vertex++) {
         if (inDegree.get(vertex) === 0) {
            yield { 
               backgroundColorVertex: [vertex, 'deeppink'],
               codeLine: 1
            };
            queue.push(vertex);
         }
      }
      // Kết thúc 2

      yield {};
      animator.graph.reset(); // Reset lại đồ thị
      queue.forEach(vertex => {
         // Chạy animation đánh dấu các đỉnh có bậc bằng 0 trước khi chạy thuật
         animator.graph.backgroundColorVertex(vertex, 'deeppink');
      });
      
      
      yield { codeLine: 2 }
      while (queue.length > 0) {
         let u = queue.shift()!;
         yield { 
            codeLine: 3,
            colorVertex: [u, 'blue']
         }

         topoOrder.push(u); // Thêm vào thứ tự topo

         yield {
            codeLine: 4,
            colorVertex: [u, 'black'],
            backgroundColorVertex: [u, 'deepskyblue'],
            highlightVertex: [u, true]
         }

         for (const v of g.neighbors(u)) {
            yield {
               codeLine: 5,
               colorEdge: [u, v, 'blue']
            }
            // Giảm đỉnh v kề u
            inDegree.set(v, inDegree.get(v)! - 1);
            yield {
               codeLine: 6,
               colorVertex: [v, 'red']
            }
            yield {
               codeLine: 7
            }

            // Đưa đỉnh v có bậc 0 vào quêu
            if (inDegree.get(v) === 0) {
               queue.push(v);
               yield {
                  codeLine: 8,
                  colorVertex: [v, 'black'],
                  highlightVertex: [v, false],
                  backgroundColorVertex: [v, 'deepskyblue']
               }
            }
         }
      }
   }
}