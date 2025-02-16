import { ReactNode } from 'react';
import { AlgorithmStep, GraphAlgorithm } from './GraphAlgorithm';
import { Form, InputNumber } from 'antd';
import Graph from '../graphs/Graph';

export interface CycleConfig
{
    startVertex: number;
}

enum Color
{
    White = 0,
    Gray = 1,
    Black = 2
}

class CycleContext
{
    public color: Color[];

    public parent: number[];

    public hasCycle: boolean = false;

    constructor(graph: Graph)
    {
        this.color = Array(graph.vertexCount + 1).fill(Color.White);
        this.parent = Array(graph.vertexCount + 1).fill(-1);
    }
}

export default class Cycle extends GraphAlgorithm<CycleConfig>
{
    public get name(): string
    {
        return 'Kiểm tra đồ thị chứa chu trình';
    }

    public predicateCheck(): { valid: boolean; error?: string; }
    {
        return { valid: true };
    }

    private *_dfs(g: Graph, u: number, ctx: CycleContext): IterableIterator<AlgorithmStep>
    {
        ctx.color[u] = Color.Gray;
        yield { animate: (animator) => animator.colorVertex(u, 'gray') };
        
        for (const v of g.neighbors(u))
        {
            if (!g.directed && v == ctx.parent[u]) continue;

            if (ctx.color[v] === Color.White)
            {
                ctx.parent[v] = u;
                yield { animate: (animator) => animator.colorEdge(u, v, 'gray', g.directed) };
                yield* this._dfs(g, v, ctx);
                if (ctx.hasCycle)
                {
                    yield { animate: (animator) => animator.colorVertex(v, 'red').colorEdge(u, v, 'red', g.directed) };
                    return;
                }
            }
            else if (ctx.color[v] === Color.Gray)
            {
                yield { animate: (animator) => animator.colorVertex(v, 'red').colorEdge(u, v, 'red', g.directed) };
                ctx.hasCycle = true;
                return;
            }
        }

        ctx.color[u] = Color.Black;
        yield { animate: (animator) => animator.colorVertex(u, 'black') };
    }

    public *run(g: Graph, config: CycleConfig): IterableIterator<AlgorithmStep>
    {
        const ctx = new CycleContext(g);
        yield* this._dfs(g, config.startVertex, ctx);

        if (!ctx.hasCycle)
        {
            for (let u = 1; u <= g.vertexCount; u++)
            {
                if (ctx.color[u] === Color.White)
                {
                    yield* this._dfs(g, u, ctx);
                }
            }
        }
    }

    public numberOfStep = 0;
    
    public runCode(g: Graph, startVertex: any, visited: any[]) {

    }

    public override configNode(graph: Graph): ReactNode
    {
        return (
            <>
                <Form.Item<CycleConfig> label="Đỉnh bắt đầu" name="startVertex" initialValue={1}>
                    <InputNumber min={1} max={graph.vertexCount} />
                </Form.Item>
            </>
        )
    }
}