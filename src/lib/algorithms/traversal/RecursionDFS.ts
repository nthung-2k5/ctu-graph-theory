import Graph from '../../graphs/Graph';
import { AlgorithmStep } from '../GraphAlgorithm';
import TraversalAlgorithm from './TraversalAlgorithm';
import { useNode } from '../../../tabs/NodeContext';

type RecursionStep = {
    text: string;
    cmt: (...args: any[]) => string | string[];
    tab: number;
};

export const recursionDFS: RecursionStep[] = [
    {
        text: 'DFS(u)',
        cmt: (vertex: number) => `DFS(${vertex})`,
        tab: 0
    },
    {
        text: 'Tiến hành thăm đỉnh u',
        cmt: (vertex: number, visited: Array<number>) => {
            let marked : number[] = [];
            visited.forEach((value, index) => {
                if (value) {
                  marked.push(index);
                }
              });
            return [
                `Đánh dấu đỉnh ${vertex} đã được thăm`,
                `visited [${marked.join(', ')}] = true`
            ]
        },
        tab: 0
    },
    {
        text: 'Xử lý đỉnh u (ví dụ: in ra u)',
        cmt: (order: Array<number>) => {
            return `Thứ tự duyệt: ${[...order].join(' -> ')}`;
        },
        tab: 0
    },
    {
        text: 'Với mỗi đỉnh kề v của u:',
        cmt: (vertex: number, neighbours: Array<number>) => {
            return [
                `Các đỉnh kề của ${vertex}`,
                `neighbours = [${neighbours.join(', ')}]`
            ]
        },
        tab: 0
    },
    {
        text: 'Nếu v chưa thăm, gọi DFS()',
        cmt: (vertex: number, mark: boolean ) => {
            return (
                mark ? `Đỉnh ${vertex} chưa được thăm -> Đi thăm` 
                : `Đỉnh ${vertex} đã được thăm -> Bỏ qua`
            );
        },
        tab: 1   
    }
];

export default class RecursionDFS extends TraversalAlgorithm
{
    public getInfo = { order: -1 };

    public get name()
    {
        return 'Duyệt theo chiều sâu (DFS) bằng đệ quy';
    }

    private resetPseudoCode() {
        const pseudoCode = document.querySelectorAll('.pseudoCodeText');
        pseudoCode.forEach(element => {
            element.classList.remove('run');
        });
    }

    private fillPseudoCode(order: number) {
        document.querySelector('.pseudoCodeContainer')?.children[order].classList.add('run');
    }

    private runPseudoCode(order: number) {
        this.resetPseudoCode();
        this.fillPseudoCode(order);
    }

    private runProgressBar(currentStep: number) {
        const progressBar = document.querySelector('.control-bar__progress input') as HTMLInputElement;
        progressBar.value = currentStep.toString();
        console.log(progressBar);
    }

    private setComment(cmt: string | string[]) {
        const commentWrapper = document.querySelector('.comment');
        if (commentWrapper) {
            if (typeof cmt === 'string') {
                commentWrapper.innerHTML = cmt;
            } else {
                commentWrapper.innerHTML = cmt.map(text => `<p>${text}</p>`).join('');
            }
        }
    }

    public override numberOfStep: number = 0;

    public override currentStep: number = 0;

    public runCode(g: Graph, startVertex: any, visited: any[]) {
        visited[startVertex] = true;

        this.numberOfStep += 3;

        const neighbors = g.neighbors(startVertex);
        
        this.numberOfStep++;

        for (const v of neighbors)
        {
            if (!visited[v])
            {
                this.numberOfStep++;
                // console.log(this.numberOfStep);
                this.runCode(g, v, visited);
            }
        }

        visited[0] = true;
    }
    
    *_traverse(g: Graph, startVertex: number, visited: boolean[]): IterableIterator<AlgorithmStep>
    {
        visited[startVertex] = true;
        // console.log(this.getInfo);

        // Chạy mã giả 1
        this.runPseudoCode(0);
        this.setComment(recursionDFS[0].cmt(startVertex));
        this.runProgressBar(++this.currentStep);

        // 1. DFS(u) -> Cho u màu đỏ
        yield { 
            animate: animator => {
                animator.colorVertex(startVertex, 'red');
            },
        };

        // Chạy mã giã 2
        this.runPseudoCode(1);
        this.setComment(recursionDFS[1].cmt(startVertex, visited));
        this.runProgressBar(++this.currentStep);

        // 2. Tiến hành thăm u -> Tô màu nút u màu #2EBBD1
        yield { 
            animate: animator => {
                animator.advancedColorVertex(startVertex, '#2EBBD1', '#fff');
            },
        };

        // Chạy mã giã 3
        this.runPseudoCode(2);
        this.setComment(recursionDFS[2].cmt([1, 2, 3, 4]));
        this.runProgressBar(++this.currentStep);

        // 3. Xử lý đỉnh u (Ví dụ in ra màn hình)
        yield { 
            animate: animator => { 
                animator.advancedColorVertex(startVertex, '#F98726', '#fff') 
            }
        };

        const neighbors = g.neighbors(startVertex);
        // Chạy mã giã 4
        this.runPseudoCode(3);
        this.setComment(recursionDFS[3].cmt(startVertex, neighbors));
        this.runProgressBar(++this.currentStep);


        for (const v of neighbors)
        {
            if (!visited[v])
            {
                // 4. Với mỗi đỉnh kề v của u
                yield { 
                    animate: animator => { 
                        animator.colorEdge(startVertex, v, 'red', g.directed);
                    }
                };

                // Chạy mã giã 5
                this.runPseudoCode(4);
                this.setComment(recursionDFS[4].cmt(v, visited));
                this.runProgressBar(++this.currentStep);

                yield { 
                    animate: animator => { 
                        animator.colorEdge(startVertex, v, 'red', g.directed);
                    }
                };

                // 5. Gọi đệ quy DFS(u)
                yield* this._traverse(g, v, visited);
            }
        }

        visited[0] = true;

        if (visited.every(value => value)) {
            this.resetPseudoCode();
            this.setComment('// Chương trình kết thúc...');
        }
    }
}