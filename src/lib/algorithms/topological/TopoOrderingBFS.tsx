import { ReactNode } from "react";
import { AlgorithmRequirements, AlgorithmStep, NeutralGraphAlgorithm } from "../GraphAlgorithm";
import { UnweightedGraph } from "../UnweightedGraph";
import { Queue } from "data-structure-typed";

export interface TopoOrderingBFSConfig {
   // startVertex: number;
   traverseAll: boolean;
}

interface TopoOrderingResult
{
   topoOrder: number[];
}

// class TopoOrderingBFSContext {

// }

class TopoSortContext {
   inDegree: number[]; 
   queue: Queue<number>;
   topoOrder: number[];

   constructor(vertexCount: number) {
       this.inDegree = Array(vertexCount + 1).fill(0);
       this.queue = new Queue<number>();
       this.topoOrder = [];
   }
}

export default class TopoOrderingBFS extends NeutralGraphAlgorithm<TopoOrderingBFSConfig, TopoOrderingResult> {
   protected override _initResult(): TopoOrderingResult 
   {
      return {
         topoOrder: [],
      };
   }

   protected override _result(result: TopoOrderingResult): ReactNode
   {
      return (
         <>
            <p>Thứ tự Topo nhận được: </p>
            {result.topoOrder.map((item, index) => {
               if (index + 1 === result.topoOrder.length) return <span>{item}</span>
               else return (
                  <span>{item + ' -> '}</span>
               )
            })}
         </>
      );
   }

   public override defaultConfig(): TopoOrderingBFSConfig 
   {
      return { 
         traverseAll: false
      };
   }

   public override get code(): string
   {
      return `#define MAX_VERTICES 100
int d[MAX_VERTICES];
void topoSort(Graph *graph, List *list) {
   // Tính bậc vào các đỉnh 
	for (int i = 1; i <= graph->n; i++) {
		d[i] = 0;
		for (int j = 1; j <= graph->n; j++)
			if (graph->A[j][i] > 0)
				d[i]++;
	}
	
   // Đưa các đỉnh có bậc bằng 0 vào hàng đợi
	Queue q; makenullQueue(&q);
	for (int i = 1; i <= graph->n; i++)
		if (d[i] == 0)
			enQueue(&q, i);
	
	makenullList(list);
	while (!isEmptyQueue(q)) {
		int u = frontQueue(q);
		deQueue(&q);
		pushList(list, u); // Đưa u vào danh sách kết quả
		for (int v = 1; v <= graph->n; i++)
			if (graph->A[u][v] > 0) {
				d[v]--; // Giảm bậc đỉnh v kề với u
				if (d[v] == 0) // Nếu đỉnh v có bậc là 0, đưa vào hàng đợi
					enQueue(&q, v);
			}
	}
}`
   }
   
   public get name(): string {
      return 'Xác định thứ tự Topo';
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

   private *_topoSort(g: UnweightedGraph, ctx: TopoSortContext, result: number[]): IterableIterator<AlgorithmStep>
   {
      let queue: number[] = [];
      yield { codeLine: 13, log: 'Khởi tạo hàng đợi Q = {}' };
      for (let u = 1; u <= g.vertexCount; u++) {
         yield { codeLine: 14, log: `` }; 
         // Duyệt đỉnh u
         yield { 
            borderColorVertex: [u, 'deeppink'],
            contentColorVertex: [u, 'whitesmoke'],
            backgroundColorVertex: [u, 'mediumpurple'],
            log: ``
         };
         // Xét điều kiện
         yield {
            codeLine: 15, 
            borderColorVertex: [u, 'purple'],
            highlightVertex: [u, true],
            log: `d[${u}] == ${ctx.inDegree[u]} == 0 (${ctx.inDegree[u] == 0})` 
         }
         yield {
            highlightVertex: [u, false],
            log: ``
         }
         if (ctx.inDegree[u] == 0) {
            queue.push(u);
            // Đưa u vào queue
            yield { 
               codeLine: 16, 
               borderColorVertex: [u, 'black'],
               backgroundColorVertex: [u, 'deeppink'], 
               log: `   Đưa ${u} vào Q` 
            };
         }
      }
      
      yield { codeLine: 18, log: 'Khởi tạo danh sách L = {}' };
      while (queue.length > 0) {
         yield {
            codeLine: 19,
            log: ``
         }
         let u = queue.shift()!;
         // Xóa bỏ khỏi queue
         yield {
            codeLine: 20,
            borderColorVertex: [u, 'black'],
            contentColorVertex: [u, 'black'],
            backgroundColorVertex: [u, 'lightgray'],
            log: `Lấy đỉnh u = ${u} ra khỏi hàng đợi Q`
         }
         yield {
            codeLine: 21,
            log: `Xóa u = ${u} khỏi Q = {${queue.join(', ')}}`
         }
         result.push(u);
         yield {
            codeLine: 22,
            borderColorVertex: [u, 'black'],
            backgroundColorVertex: [u, 'darkorange'],
            contentColorVertex: [u, 'whitesmoke'],
            log: `Đưa u = ${u} vào L = {${result.join(', ')}}`
         }
         for (let v = 1; v <= g.vertexCount; v++) {
            yield { codeLine: 23, log: `` }
            yield {
               codeLine: 24,
               // borderColorVertex: [v, 'red'],
               // highlightVertex: [u, true],
               // colorEdge: [u, v, 'green'],
               log: `   graph->A[${u}][${v}] == ${g.matrix[u][v]} > 0 (${g.matrix[u][v] > 0})`
            }
            if (g.adjacent(u, v)) {
               ctx.inDegree[v]--;
               // Duyệt kề để giảm bậc 
               yield {
                  colorEdge: [u, v, 'dodgerblue'],
                  log: ``
               }
               // Giảm bậc
               yield {
                  codeLine: 25,
                  borderColorVertex: [v, 'red'],
                  highlightVertex: [v, true],
                  log: `      d[${v}]-- = ${ctx.inDegree[v]}`
               }
               // Trả về lúc ban đầu
               yield {
                  borderColorVertex: [v, 'purple'],
                  highlightVertex: [v, false],
                  log: ``
               }
               // Xét điều kiện
               yield {
                  codeLine: 26,
                  highlightVertex: [v, true],
                  borderColorVertex: [v, 'purple'],
                  log: `      d[${v}] == ${ctx.inDegree[v]} == 0 (${ctx.inDegree[v] == 0})`
               }
               // Trả về lúc ban đầu
               yield {
                  highlightVertex: [v, false],
                  log: ``
               }
               if (ctx.inDegree[v] == 0) {
                  queue.push(v);
                  // Thêm vào queue
                  yield {
                     codeLine: 27,
                     highlightVertex: [v, false],
                     borderColorVertex: [v, 'black'],
                     backgroundColorVertex: [v, 'deeppink'],
                     log: `Đưa v = ${v} vào Q = {${queue.join(', ')}}`
                  }
               }
            }
         }
      }
   }

   protected *_run(g: UnweightedGraph, config: TopoOrderingBFSConfig, result: TopoOrderingResult): IterableIterator<AlgorithmStep> {
      const ctx = new TopoSortContext(g.vertexCount);
   
      // Tính bậc vào cho từng đỉnh
      for (let u = 1; u <= g.vertexCount; u++) {
         yield { codeLine: 5, log: `` }
         // *
         yield { 
            codeLine: 6, 
            borderColorVertex: [u, 'deeppink'],
            contentColorVertex: [u, 'whitesmoke'],
            backgroundColorVertex: [u, 'mediumpurple'],
            log: `d[${u}] = 0` 
         }
         for (let v = 1; v <= g.vertexCount; v++) {
            yield { codeLine: 7, log: `` }
            yield { 
               codeLine: 8,
               log: `   graph->A[${v}][${u}] == ${g.matrix[v][u]} > 0 (${g.matrix[v][u] > 0})` 
            }
            if (g.adjacent(v, u)) {
               ctx.inDegree[u]++;
               // Tăng bậc cho nó
               yield {
                  codeLine: 9,
                  borderColorVertex: [u, 'limegreen'],
                  highlightVertex: [u, true],
                  log: `      d[${u}]++ = ${ctx.inDegree[u]}`
               }
               // Cho nó quay lại bình thường giống *
               yield {
                  borderColorVertex: [u, 'deeppink'],
                  contentColorVertex: [u, 'whitesmoke'],
                  backgroundColorVertex: [u, 'mediumpurple'],
                  highlightVertex: [u, false],
                  log: ``
               }
            }
         }
      }

      // reset Đồ thị để nhảy vào topo sort
      yield {
         reset: true,
         log: `d[] = {${ctx.inDegree.join(', ')}}`
      };

      yield* this._topoSort(g, ctx, result.topoOrder);
   }
  

}