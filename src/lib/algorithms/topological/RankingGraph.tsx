import { ReactNode } from "react";
import { AlgorithmStep } from "../GraphAlgorithm";
import { UnweightedGraph } from "../UnweightedGraph";
import { Queue } from "data-structure-typed";
import TopologicalAlgorithm from './TopologicalAlgorithm';
import store from '../../context/store';

export default class RankingGraph extends TopologicalAlgorithm
{
    protected override _initResult(): number[]
    {
        const { vertexCount } = store.getState().graph;
        return Array(vertexCount + 1).fill(0);
    }
    
    protected override _result(result: number[]): ReactNode
    {
        // Group vertices by their rank
        const ranks: number[][] = Array.from({ length: Math.max(...result) + 1 }, () => []);
        for (let v = 1; v < result.length; v++)
        {
            ranks[result[v]].push(v);
        }

        return (
            <>
                <p>Hạng của các đỉnh: </p>
                {ranks.map((vertices, index) => 
                {
                    return <p key={index}>Hạng {index + 1}: {vertices.join(', ')}</p>;
                })}
            </>
        );
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
   
    public get name(): string 
    {
        return 'Xếp hạng đồ thị';
    }

    protected *_topologicalSort(g: UnweightedGraph, inDegree: number[], ranking: number[]): IterableIterator<AlgorithmStep>
    {
        const queue = new Queue<number>();
        // 1. Tính bậc vào của mỗi đỉnh
        for (let i = 1; i <= g.vertexCount; i++) 
        {
            ranking[i] = 0;
            inDegree[i] = 0;
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
   
        for (let i = 1; i <= g.vertexCount; i++) 
        {
            yield { 
                codeLine: 10, 
                borderColorVertex: [i, 'deeppink'],
                contentColorVertex: [i, 'whitesmoke'],
                backgroundColorVertex: [i, 'mediumpurple'],
                log: `Tính bán bậc vào đỉnh ${i}` 
            }
            for (let j = 1; j <= g.vertexCount; j++) 
            {
                yield { codeLine: 11, log: `` }
                yield { 
                    codeLine: 12,
                    log: `graph.A[${j}][${i}] == ${g.matrix[j][i]} > 0 (${g.matrix[j][i] > 0})`
                }
                if (g.matrix[j][i] > 0) 
                {
                    inDegree[i]++;
                    yield {
                        codeLine: 13,
                        borderColorVertex: [i, 'limegreen'],
                        highlightVertex: [i, true],
                        log: `d[${i}]++ = ${inDegree[i]}`
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
        for (let i = 1; i <= g.vertexCount; i++) 
        {
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
                log: `   d[${i}] == ${inDegree[i]} (${inDegree[i] == 0})`
            }
            if (inDegree[i] == 0) 
            {
                queue.push(i);
                yield {
                    codeLine: 19,
                    borderColorVertex: [i, 'black'],
                    highlightVertex: [i, false],
                    backgroundColorVertex: [i, 'deeppink'], 
                    log: `      Đưa ${i} vào Q = {${queue.join(', ')}}`
                }
            }
            else 
            { // Nếu điều kiện sai thì tạm thời bỏ hightlight
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
        while (queue.length > 0) 
        {
            yield { 
                codeLine: 22, 
                log: `Hàng đợi Q = {${queue.join(', ')}} != ∅ (${!queue.isEmpty()})` 
            }
            for (let i = 0; i < queue.length; i++) 
            {
                yield { codeLine: 23, log: `` }
                const u = queue.shift()!;
                yield {
                    codeLine: 24,
                    borderColorVertex: [u, 'black'],
                    contentColorVertex: [u, 'black'],
                    backgroundColorVertex: [u, 'lightgray'],
                    log: `   Lấy đỉnh u = ${u} ra khỏi hàng đợi Q`
                }
                yield {
                    codeLine: 25,
                    log: `   Xóa u = ${u} khỏi Q = {${queue.join(', ')}}`
                }
                for (let j = 1; j <= g.vertexCount; j++) 
                {
                    yield { codeLine: 26, log: `` }
                    yield {
                        codeLine: 27,
                        log: `      graph->A[${u}][${j}] == ${g.matrix[u][j]} > 0 (${g.matrix[u][j] > 0})`
                    }
                    if (g.matrix[u][j] > 0) 
                    {
                        inDegree[j]--;
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
                            log: `         d[${j}]-- = ${inDegree[j]}`
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
                            log: `      d[${j}] == ${inDegree[j]} == 0 (${inDegree[j] == 0})`
                        }
                        if ( inDegree[j] == 0) 
                        {
                            queue.push(j);
                            yield {
                                codeLine: 30,
                                borderColorVertex: [j, 'black'],
                                highlightVertex: [j, false],
                                backgroundColorVertex: [j, 'deeppink'], 
                                log: `         Đưa ${j} vào Q = {${queue.join(', ')}}`
                            }
                            ranking[j] = k + 1;
                            // Xếp hạng cho đỉnh j
                            yield {
                                codeLine: 31,
                                borderColorVertex: [j, 'black'],
                                backgroundColorVertex: [j, 'darkorange'],
                                contentColorVertex: [j, 'whitesmoke'],
                                log: `         Xếp hạng cho ${j}, ranking[${j}] = ${ranking[j]}`
                            }
                        }
                        else 
                        {
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
}