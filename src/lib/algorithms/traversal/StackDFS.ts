import { Stack } from 'data-structure-typed';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';
import { PseudocodeLine } from '../../pseudocode/Pseudocode';
import { UnweightedGraph } from '../UnweightedGraph';

export default class StackDFS extends TraversalAlgorithm
{
    public override get pseudocode(): PseudocodeLine[] 
    {
        return [
            { text: 'while (stack != ∅)', tab: 0 },
            { text: 'u <- stack;', tab: 1 },
            { text: 'if (duyet[u] == true)', tab: 1 },
            { text: 'continue;', tab: 2 },
            { text: '// Duyệt u;', tab: 1, comment: true },
            { text: 'stack[u] = true;', tab: 1 },
            { text: 'for (đỉnh v kề với u)', tab: 1 },
            { text: 'if (stack[v] != true)', tab: 2 },
            { text: 'queue <- v;', tab: 3 },
        ]
    }

    public get name()
    {
        return 'Duyệt theo chiều sâu (DFS) bằng ngăn xếp';
    }

    *_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[]): IterableIterator<AlgorithmStep>
    {
        const stack: Stack<number> = new Stack<number>();
    
        stack.push(startVertex);
            
        yield { codeLine: 0 };
        while (!stack.isEmpty())
        {
            const u = stack.pop()!;
            yield { codeLine: 1 };
    
            yield { codeLine: 2 };
            if (visited[u])
            {
                yield { codeLine: 3 };
                yield { codeLine: 0 };
                continue;
            }
    
            yield {
                colorVertex: [u, 'red'],
                colorEdge: parent[u] !== -1 ? [parent[u], u, 'red'] : undefined,
                codeLine: 4
            };
    
            visited[u] = true;
            yield { codeLine: 5 };
    
            const neighbors = g.neighbors(u);
    
            yield { codeLine: 6 };
            for (const v of neighbors)
            {
                yield { codeLine: 7 };
                if (!visited[v])
                {
                    stack.push(v);
                    yield {
                        colorVertex: parent[v] === -1 ? [v, 'blue'] : undefined,
                        colorEdge: parent[v] === -1 ? [u, v, 'blue'] : undefined,
                        codeLine: 8
                    };

                    if (parent[v] === -1)
                    {
                        parent[v] = u;
                    }
                }
                yield { codeLine: 6 };
            }

            yield { codeLine: 0 };
        }
    }
}