import { ReactNode } from "react";
import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from "../GraphAlgorithm";
import { UnweightedGraph } from "../UnweightedGraph";
import { Queue } from "data-structure-typed";

export interface RankingGraphConfig {
   // startVertex: number;
   traverseAll: boolean;
}

interface RankingGraphResult
{
   ranking: number[];
}

class RankingGraphContext {
   inDegree: number[]; 
   queue: Queue<number>;
   ranking: number[];

   constructor(vertexCount: number) {
      this.inDegree = Array(vertexCount + 1).fill(0);
      this.queue = new Queue<number>();
      this.ranking = [];
   }
}

export default class RankingGraph extends NeutralGraphAlgorithm<RankingGraphConfig, RankingGraphResult> {
   protected override _initResult(): RankingGraphResult 
   {
      return {
         ranking: [],
      };
   }

   protected override _result(result: RankingGraphResult): ReactNode
   {
      return (
         <>
            <p>Thứ hạng các đỉnh: </p>
            {result.ranking.map((item: number, index: number) => {
               return (
                  <p>Ranking {index}: {item}</p>
               );
            })}
         </>
      );
   }

   public override defaultConfig(): RankingGraphConfig 
   {
      return { 
         traverseAll: false
      };
   }

   public override get code(): string
   {
      return `int rank[MAX_VERTICES];
int d[MAX_VERTICES];
void ranking(Graph graph) {
   // Khởi tạo bậc và ranking cho các đỉnh 
	for (int u = 1; u <= graph.n; u++) {
		rank[u] = 0; d[u] = 0;
	}
	
   // Tính bậc bán vào của các đỉnh
	for (int u = 1; u <= graph.n; u++) 
		for (int v = 1; v <= graph.n; v++) 
			if (graph.A[v][u] > 0)
				d[v]++;
	
	Queue q; makenullQueue(&q);
   // Đưa các đỉnh có bậc vào bằng 0 vào hàng đợi
	for (int u = 1; u <= graph.n; u++)
		if (d[u] == 0) 
         enQueue(&q, u);
	
	int k = 0;
	while (!isEmptyQueue(q)) {
		for (int i = 0; i < q.size; i++) {
			int u = frontQueue(q);
         deQueue(&q);
			for (int v = 1; v <= graph.n; v++)
				if (graph.A[u][v] > 0) {
					d[v]--;
					if (d[v] == 0) {
						enQueue(&q, v);
						rank[v] = k + 1;
					}
				}
		}
		k++;
	}
}`
   }
   
   public get name(): string {
      return 'Xếp hạng đồ thị';
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

   private *_ranking(g: UnweightedGraph, ctx: RankingGraphContext, result: number[]): IterableIterator<AlgorithmStep>
   {
      // 1. Tính bậc vào của mỗi đỉnh
      for (let i = 1; i <= g.vertexCount; i++) {
         ctx.ranking[i] = 0;
         ctx.inDegree[i] = 0;
         result[i] = 0;
         yield { codeLine: 5, log: `` }
         yield { 
            codeLine: 6,
            borderColorVertex: [i, 'deeppink'],
            contentColorVertex: [i, 'whitesmoke'],
            backgroundColorVertex: [i, 'mediumpurple'],
            log: `rank[${i}] = d[${i}] = 0`
         };
      }

      yield { log: `` }
      yield { reset: true, log: `` }
   
      for (let i = 1; i <= g.vertexCount; i++) {
         yield { 
            codeLine: 10, 
            borderColorVertex: [i, 'deeppink'],
            contentColorVertex: [i, 'whitesmoke'],
            backgroundColorVertex: [i, 'mediumpurple'],
            log: `Tính bán bậc vào đỉnh ${i}` 
         }
         for (let j = 1; j <= g.vertexCount; j++) {
            yield { codeLine: 11, log: `` }
            yield { 
               codeLine: 12,
               log: `graph.A[${j}][${i}] == ${g.matrix[j][i]} > 0 (${g.matrix[j][i] > 0})`
            }
            if (g.matrix[j][i] > 0) {
               ctx.inDegree[i]++;
               yield {
                  codeLine: 13,
                  borderColorVertex: [i, 'limegreen'],
                  highlightVertex: [i, true],
                  log: `d[${i}]++ = ${ctx.inDegree[i]}`
               }
               // Trả về
               yield {
                  borderColorVertex: [i, 'deeppink'],
                  highlightVertex: [i, false],
                  log: ``
               }
            }
         }
      }
      // Kết thúc bước 1

      yield { reset: true, log: `` } // Reset để nhảy vào ranking
   
      // 2. Đưa các đỉnh có bậc vào = 0 vào hàng đợi
      for (let i = 1; i <= g.vertexCount; i++) {
         yield { 
            codeLine: 17, 
            borderColorVertex: [i, 'deeppink'],
            contentColorVertex: [i, 'whitesmoke'],
            backgroundColorVertex: [i, 'mediumpurple'],
            log: `Xét đỉnh ${i}` 
         }
         yield { 
            codeLine: 18,
            borderColorVertex: [i, 'purple'],
            highlightVertex: [i, true],
            log: `   d[${i}] == ${ctx.inDegree[i]} (${ctx.inDegree[i] == 0})`
         }
         if (ctx.inDegree[i] == 0) {
            ctx.queue.push(i);
            yield {
               codeLine: 19,
               borderColorVertex: [i, 'black'],
               highlightVertex: [i, false],
               backgroundColorVertex: [i, 'deeppink'], 
               log: `      Đưa ${i} vào Q = {${ctx.queue.join(', ')}}`
            }
         }
         else { // Nếu điều kiện sai thì tạm thời bỏ hightlight
            yield {
               highlightVertex: [i, false],
               log: ``
            }
         }
      }
      // Kết thúc bước 2

      yield { reset: true, log: `` } // Reset để nhảy vào ranking
   
      let k = 0;
      yield { codeLine: 21, log: `k = 0` }
      while (ctx.queue.length > 0) {
         yield { 
            codeLine: 22, 
            log: `Hàng đợi Q = {${ctx.queue.join(', ')}} != ∅ (${!ctx.queue.isEmpty})` 
         }
         const size = ctx.queue.length;
         for (let i = 0; i < size; i++) {
            yield { codeLine: 23, log: `` }
            const u = ctx.queue.shift()!;
            yield {
               codeLine: 24,
               borderColorVertex: [u, 'black'],
               contentColorVertex: [u, 'black'],
               backgroundColorVertex: [u, 'lightgray'],
               log: `   Lấy đỉnh u = ${u} ra khỏi hàng đợi Q`
            }
            yield {
               codeLine: 25,
               log: `   Xóa u = ${u} khỏi Q = {${ctx.queue.join(', ')}}`
            }
            for (let j = 1; j <= g.vertexCount; j++) {
               yield { codeLine: 26, log: `` }
               yield {
                  codeLine: 27,
                  log: `      graph->A[${u}][${j}] == ${g.matrix[u][j]} > 0 (${g.matrix[u][j] > 0})`
               }
               if (g.matrix[u][j] > 0) {
                  ctx.inDegree[j]--;
                  // Duyệt kề để giảm bậc 
                  yield {
                     colorEdge: [u, j, 'dodgerblue'],
                     log: ``
                  }
                  // Giảm bậc
                  yield {
                     codeLine: 28,
                     borderColorVertex: [j, 'red'],
                     highlightVertex: [j, true],
                     log: `         d[${j}]-- = ${ctx.inDegree[j]}`
                  }
                  // Trả về lúc ban đầu
                  // yield {
                  //    borderColorVertex: [j, 'black'],
                  //    highlightVertex: [j, false],
                  //    log: ``
                  // }
                  // Xét điều kiện
                  yield {
                     codeLine: 29,
                     highlightVertex: [j, true],
                     borderColorVertex: [j, 'purple'],
                     log: `      d[${j}] == ${ctx.inDegree[j]} == 0 (${ctx.inDegree[j] == 0})`
                  }
                  if (ctx.inDegree[j] == 0) {
                     ctx.queue.push(j);
                     yield {
                        codeLine: 30,
                        borderColorVertex: [j, 'black'],
                        highlightVertex: [j, false],
                        backgroundColorVertex: [j, 'deeppink'], 
                        log: `         Đưa ${j} vào Q = {${ctx.queue.join(', ')}}`
                     }
                     ctx.ranking[j] = k + 1;
                     result[j] = k + 1;
                     // Xếp hạng cho đỉnh j
                     yield {
                        codeLine: 31,
                        borderColorVertex: [j, 'black'],
                        backgroundColorVertex: [j, 'darkorange'],
                        contentColorVertex: [j, 'whitesmoke'],
                        log: `         Xếp hạng cho ${j}, ranking[${j}] = ${ctx.ranking[j]}`
                     }
                  }
                  else {
                     yield {
                        borderColorVertex: [j, 'black'],
                        highlightVertex: [j, false],
                        log: ``
                     }
                  }
               }
            }
         }
         k++;
      }
   }

   protected override *_run(g: UnweightedGraph, config: RankingGraphConfig, result: RankingGraphResult): IterableIterator<AlgorithmStep> 
   {
      const ctx = new RankingGraphContext(g.vertexCount);
      yield* this._ranking(g, ctx, result.ranking);
   }   
   
}