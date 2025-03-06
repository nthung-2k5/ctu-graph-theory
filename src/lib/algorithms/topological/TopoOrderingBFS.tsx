import { ReactNode } from "react";
import { PseudocodeLine } from "../../pseudocode/Pseudocode";
import { CycleConfig } from "../connectivity/Cycle";
import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from "../GraphAlgorithm";
import { Form, InputNumber, Select, Space } from "antd";
import store from "../../context/store";
import { UnweightedGraph } from "../UnweightedGraph";
import Animator from "../../animation/Animator";

export interface TopoOrderingBFSConfig {
   startVertex: number;
}

class TopoOrderingBFSContext {

}

export default class TopoOrderingBFS extends NeutralGraphAlgorithm<TopoOrderingBFSConfig> {
   public get name(): string {
      return 'Xác định thứ tự Topo';
   }

   public override get pseudocode(): PseudocodeLine[] {
      return [
         { text: 'Tính bậc vào của mỗi đỉnh', tab: 0 },
         { text: 'Khởi tạo hàng đợi queue với các đỉnh có bậc vào = 0', tab: 0 },
         { text: 'while (queue != ∅)', tab: 0 },
         { text: 'u <- queue;', tab: 1 },
         { text: 'Thêm u vào danh sách kết quả', tab: 1 },
         { text: 'for (đỉnh v kề với u)', tab: 1 },
         { text: 'Giảm bậc vào của v đi 1', tab: 2 },
         { text: 'if (bậc vào của v == 0)', tab: 2 },
         { text: 'queue <- v;', tab: 3 },
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

      for (let vertex = 1; vertex <= g.vertexCount; vertex++) {
         yield { 
            colorVertex: [vertex, 'green'],
            highlightVertex: [vertex, true],
            codeLine: 0 
         }; // Tính bậc cho mỗi đỉnh
         inDegree.set(vertex, 0);
      }
      
      for (const edge of g.edges) {
         inDegree.set(edge.v, (inDegree.get(edge.v) || 0) + 1);
      }

      for (let [vertex, degree] of inDegree.entries()) {
         if (degree === 0) { 
            yield { 
               colorVertex: [vertex, 'deeppink'],
               highlightVertex: [vertex, true],
               codeLine: 1
            }; // Bỏ vertex vào Hàng đợi 
            queue.push(vertex);
         }
      }

      yield {};
      animator.graph.reset(); // Reset lại đồ thị
  
      while (queue.length > 0) {
         let u = queue.shift()!; // Lấy đỉnh đầu hàng đợi
         topoOrder.push(u); // Thêm vào thứ tự topo

         for (const edge of g.edges) {
            if (edge.u === u) {
               inDegree.set(edge.v, inDegree.get(edge.v)! - 1);
               if (inDegree.get(edge.v) === 0) {
                     queue.push(edge.v);
               }
            }
         }
      }

      // if (topoOrder.length < g.vertexCount) {
      //    alert('Đồ thị có chu trình');
      // }
   }
}