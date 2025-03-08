import { Stack } from 'data-structure-typed';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';
import { UnweightedGraph } from '../UnweightedGraph';

export default class StackDFS extends TraversalAlgorithm
{
    public override get code(): string
    {
        return `int mark[MAX_N];
    
    void DFS(Graph* G, int s) {
        Stack Q; makeNullStack&Q);
    
        push(&Q, s);
    
        while (!empty(Q)) {
            int u = top(Q); pop(&Q);
            if (mark[u])
                continue;
    
            mark[u] = 1;
    
            for (int v = 1; v <= n; v++)
                if (adjacent(G, u, v) && !mark[v])
                    push(Q, v);
        }
    }`;
    }
    
    public get name()
    {
        return 'Duyệt theo chiều sâu (DFS) bằng ngăn xếp';
    }
    
    *_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[]): IterableIterator<AlgorithmStep>
    {
        yield {
            codeLine: 3,
            log: `DFS(G, ${startVertex})`
        };
        const stack: Stack<number> = new Stack<number>();
        yield {
            codeLine: 4,
            log: `Q = {}`
        };
            
        stack.push(startVertex);
        yield { 
            codeLine: 6,
            highlightVertex: [startVertex, true],
            colorVertex: [startVertex, 'orange'],
            log: `Q = {${startVertex}}`
        };
            
        yield {
            codeLine: 8,
            log: `Q = {${startVertex}} => Bắt đầu duyệt`
        };
        while (!stack.isEmpty())
        {
            const u = stack.pop()!;
    
            yield { 
                codeLine: 9,
                highlightVertex: [u, true],
                colorVertex: [u, 'yellow'], 
                log: `u = ${u}, Q = {${stack.toArray().join(', ')}}`
            };
    
            yield {
                codeLine: 10,
                log: `mark[${u}] = ${visited[u]}`
            };
            if (visited[u])
            {
                yield { codeLine: 11, log: `Đã duyệt ${u}, bỏ qua` };
                continue;
            }
    
            visited[u] = true;
            yield {
                colorVertex: [u, 'red'],
                colorEdge: parent[u] !== -1 ? [parent[u], u, 'red'] : undefined,
                codeLine: 13,
                log: `mark[${u}] = true`
            };
    
            yield {
                codeLine: 15,
                log: `v = 1`
            };
            for (let v = 1; v <= g.vertexCount; v++)
            {
                yield {
                    codeLine: 16, 
                    highlightVertex: [v, true],
                    highlightEdge: [u, v, true],
                    log: `G->A[${u}][${v}] = ${g.matrix[u][v]}, mark[${v}] = ${visited[v]}`
                };
    
                if (g.matrix[u][v] && !visited[v])
                {
                    stack.push(v);
    
                    let colorEdge = {};
    
                    if (parent[v] === -1)
                    {
                        parent[v] = u;
                        colorEdge = {
                            colorEdge: [u, v, 'blue'],
                        };
                    }
    
                    yield { 
                        codeLine: 17,
                        colorVertex: [v, 'orange'],
                        ...colorEdge,
                        log: `Q = {${stack.toArray().join(', ')}}`
                    };
                }
                yield { codeLine: 15, highlightVertex: u !== v ? [v, false]: undefined, highlightEdge: [u, v, false], log: `v = ${v + 1}` };
            }
    
            yield { 
                codeLine: 18, 
                highlightVertex: [u, false],
                colorVertex: [u, 'purple'],
                log: `Kết thúc duyệt ${u}`
            };
    
            yield { codeLine: 8, log: `Q = {${stack.toArray().join(', ')}}` };
        }
    
        yield { codeLine: 19, log: 'Kết thúc' };
    }
}