import Animator from "../../animation/Animator";
import { PseudocodeLine } from "../../pseudocode/Pseudocode";
import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from "../GraphAlgorithm";
import { UnweightedGraph } from "../UnweightedGraph";
import { RankingGraphConfig } from "./RankingGraph";

export interface ManageProjectConfig {}

export default class ManageProject extends NeutralGraphAlgorithm<ManageProject> {
   public get name(): string {
      return 'Quản lý dự án';
   }

   public override get pseudocode(): PseudocodeLine[] {
      return [
         { text: 'Tính bậc vào của mỗi đỉnh', tab: 0 },
         { text: 'Khởi tạo hàng đợi Q chứa các đỉnh có bậc vào = 0', tab: 0 },
         { text: 'int k = 0', tab: 0 },
         { text: 'while (Q != ∅)', tab: 0 },
         { text: 'for (i = 0; i < Q.size; i++)', tab: 1 },
         { text: 'u <- dequeue(Q);', tab: 2 },
         { text: 'ranking[u] = k++;', tab: 2 },
         { text: 'for (đỉnh v kề với u)', tab: 2 },
         { text: 'Giảm bậc vào của v đi 1', tab: 3 },
         { text: 'if (bậc vào của v == 0)', tab: 3 },
         { text: 'enqueue(Q, v);', tab: 4 },
      ];
   }

   public override get predicate(): AlgorithmRequirements {
      return {
         directed: true,
         weighted: undefined,
         acyclic: true,
      };
   }

   protected override *_run(g: UnweightedGraph, config: RankingGraphConfig, animator: Animator): IterableIterator<AlgorithmStep> {
      const n = g.vertexCount;
      const t: number[] = new Array(n + 1).fill(-Infinity);
      const T: number[] = new Array(n + 1).fill(Infinity);
      const inDegree: number[] = new Array(n + 1).fill(0);
      const queue: number[] = [];
      const topoOrder: number[] = [];

      for (let u = 1; u <= n; u++) {
         for (const v of g.neighbors(u)) {
            inDegree[v]++;
         }
      }

      for (let u = 1; u <= n; u++) {
         if (inDegree[u] === 0) {
            queue.push(u);
         }
      }

      while (queue.length > 0) {
         const u = queue.shift()!;
         topoOrder.push(u);
         for (const v of g.neighbors(u)) {
            inDegree[v]--;
            if (inDegree[v] === 0) { 
               queue.push(v);
            }
         }
      }

      let trongso = 16 / 5 / 2004;

      t[0] = 0;
      for (const u of topoOrder) {
         for (const v of g.neighbors(u)) {
            t[v] = Math.max(t[v], t[u] + trongso);
         }
      }

      T[n] = t[n];
      for (let i = topoOrder.length - 1; i >= 0; i--) {
         const u = topoOrder[i];
         for (const v of g.neighbors(u)) {
            T[u] = Math.min(T[u], T[v] - trongso);
         }
      }
   }
}