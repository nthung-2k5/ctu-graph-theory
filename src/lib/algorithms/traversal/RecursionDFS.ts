import { UnweightedGraph } from '../UnweightedGraph';
import { PseudocodeLine } from '../../pseudocode/Pseudocode';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';

// type RecursionStep = {
//     text: string;
//     cmt: (...args: any[]) => string | string[];
//     tab: number;
// };

// export const recursionDFS: RecursionStep[] = [
//     {
//         text: 'DFS(u)',
//         cmt: (vertex: number) => `DFS(${vertex})`,
//         tab: 0
//     },
//     {
//         text: 'Tiến hành thăm đỉnh u',
//         cmt: (vertex: number, visited: Array<number>) => 
//         {
//             const marked : number[] = [];
//             visited.forEach((value, index) => 
//             {
//                 if (value) 
//                 {
//                     marked.push(index);
//                 }
//             });
//             return [
//                 `Đánh dấu đỉnh ${vertex} đã được thăm`,
//                 `visited [${marked.join(', ')}] = true`
//             ]
//         },
//         tab: 0
//     },
//     {
//         text: 'Xử lý đỉnh u (ví dụ: in ra u)',
//         cmt: (order: Array<number>) => 
//         {
//             return `Thứ tự duyệt: ${[...order].join(' -> ')}`;
//         },
//         tab: 0
//     },
//     {
//         text: 'Với mỗi đỉnh kề v của u:',
//         cmt: (vertex: number, neighbours: Array<number>) => 
//         {
//             return [
//                 `Các đỉnh kề của ${vertex}`,
//                 `neighbours = [${neighbours.join(', ')}]`
//             ]
//         },
//         tab: 0
//     },
//     {
//         text: 'Nếu v chưa thăm, gọi DFS()',
//         cmt: (vertex: number, mark: boolean ) => 
//         {
//             return (
//                 mark ? `Đỉnh ${vertex} chưa được thăm -> Đi thăm` 
//                     : `Đỉnh ${vertex} đã được thăm -> Bỏ qua`
//             );
//         },
//         tab: 1   
//     }
// ];

export default class RecursionDFS extends TraversalAlgorithm
{
    public override get pseudocode(): PseudocodeLine[] 
    {
        return [
            { text: 'DFS(u)', tab: 0 },
            { text: '// Duyệt u', tab: 1, comment: true },
            { text: 'duyet[u] = true;', tab: 1 },
            { text: 'for (đỉnh v kề với u)', tab: 1 },
            { text: 'if (duyet[v] != true)', tab: 2 },
            { text: 'DFS(v);', tab: 3 },
        ];
    }

    public get name()
    {
        return 'Duyệt theo chiều sâu (DFS) bằng đệ quy';
    }
    
    *_traverse(g: UnweightedGraph, startVertex: number, visited: boolean[], parent: number[]): IterableIterator<AlgorithmStep>
    {
        yield { codeLine: 0 };
        yield { codeLine: 1 };

        visited[startVertex] = true;

        yield {
            colorVertex: [startVertex, 'red'],
            colorEdge: parent[startVertex] !== -1 ? [parent[startVertex], startVertex, 'red'] : undefined,
            codeLine: 2
        };

        const neighbors = g.neighbors(startVertex);

        yield { codeLine: 3 };
        for (const v of neighbors)
        {
            yield { codeLine: 4 };
            if (!visited[v])
            {
                yield {
                    colorVertex: parent[v] === -1 ? [v, 'blue'] : undefined,
                    colorEdge: parent[v] === -1 ? [startVertex, v, 'blue'] : undefined,
                    codeLine: 5
                };

                if (parent[v] === -1)
                {
                    parent[v] = startVertex;
                }
                
                yield* this._traverse(g, v, visited, parent);
            }

            yield { codeLine: 3 };
        }

        visited[0] = true;
    }
}