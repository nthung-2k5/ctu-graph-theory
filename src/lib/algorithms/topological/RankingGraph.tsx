import { ReactNode } from "react";
import { PseudocodeLine } from "../../pseudocode/Pseudocode";
import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from "../GraphAlgorithm";
import { UnweightedGraph } from "../UnweightedGraph";
import Animator from "../../animation/Animator";

export interface RankingGraphConfig {
   
}

export default class RankingGraph extends NeutralGraphAlgorithm<RankingGraphConfig> {
   public get name(): string {
      return 'Xếp hạng đồ thị';
   }

   public override get pseudocode(): PseudocodeLine[] {
      return [
         { text: 'Tính bậc vào của mỗi đỉnh', tab: 0 },
         { text: 'Khởi tạo hàng đợi Q chứa các đỉnh có bậc vào = 0', tab: 0 },
         { text: 'int k = 0', tab: 0 },
         { text: 'while (Q != ∅)', tab: 0 },
         { text: 'for (i = 0; i < Q.size; i++)', tab: 1 },
         { text: 'u <- dequeue(Q);', tab: 2 }, // Lấy và loại bỏ đỉnh đầu tiên
         { text: 'ranking[u] = k++;', tab: 2 }, // Xếp hạng cho đỉnh u
         { text: 'for (đỉnh v kề với u)', tab: 2 },
         { text: 'Giảm bậc vào của v đi 1', tab: 3 },
         { text: 'if (bậc vào của v == 0)', tab: 3 },
         { text: 'enqueue(Q, v); ', tab: 4 }, // Thêm v vào hàng đợi
      ];
   }
   

   public override get predicate(): AlgorithmRequirements {
      return { 
         directed: true, // Đồ thị phải là có hướng
         weighted: undefined, // Đồ thị phải có trọng số hay không đều được 
         acyclic: true, // Đồ thị không được có chu trình 
      }; // Điều kiện của đồ thị
   }

   public override configNode(): ReactNode {
      return (
         <></>
      );
   }

   protected override *_run(g: UnweightedGraph, config: RankingGraphConfig, animator: Animator): IterableIterator<AlgorithmStep> {
      const inDegree = new Map<number, number>(); // Bậc vào của mỗi đỉnh
      const ranking = new Map<number, number>(); // Xếp hạng của mỗi đỉnh
      const queue: number[] = []; // Hàng đợi chứa các đỉnh có bậc vào = 0
   
      // 1. Tính bậc vào của mỗi đỉnh
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
      // Kết thúc bước 1
   
      // 2. Đưa các đỉnh có bậc vào = 0 vào hàng đợi
      for (let vertex = 1; vertex <= g.vertexCount; vertex++) {
         if (inDegree.get(vertex) === 0) {
            yield { 
               backgroundColorVertex: [vertex, 'deeppink'],
               codeLine: 1
            };
            queue.push(vertex);
         }
      }
      // Kết thúc bước 2

      yield {};
      animator.graph.reset(); // Reset lại đồ thị
      queue.forEach(vertex => {
         // Chạy animation đánh dấu các đỉnh có bậc bằng 0 trước khi chạy thuật
         animator.graph.backgroundColorVertex(vertex, 'deeppink');
      });
   
      let k = 0;
      yield { codeLine: 2 }

      yield { codeLine: 3 }
      while (queue.length > 0) {
         const size = queue.length;
         for (let i = 0; i < size; i++) {
            yield { codeLine: 4 }
            const u = queue.shift()!; // Lấy và loại bỏ phần tử đầu tiên của queue
            yield { 
               codeLine: 5,
               colorVertex: [u, 'blue']
            }

            ranking.set(u, k++); // Xếp hạng cho đỉnh
            yield {
               codeLine: 6,
               colorVertex: [u, 'black'],
               backgroundColorVertex: [u, 'deepskyblue'],
               highlightVertex: [u, true]
            }
   
            for (const v of g.neighbors(u)) {
               yield {
                  codeLine: 7,
                  colorEdge: [u, v, 'blue']
               }
               inDegree.set(v, inDegree.get(v)! - 1); // Giảm bậc
               yield {
                  codeLine: 8,
                  colorVertex: [v, 'red']
               }
               yield {
                  codeLine: 9
               }
               if (inDegree.get(v) === 0) {
                  queue.push(v);
                  yield {
                     codeLine: 10,
                     colorVertex: [v, 'black'],
                     highlightVertex: [v, false],
                     backgroundColorVertex: [v, 'deepskyblue']
                  }
               }
            }
         }
      }
   }   
   
}