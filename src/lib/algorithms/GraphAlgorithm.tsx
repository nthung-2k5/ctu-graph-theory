import { ReactNode } from 'react';
import { UnweightedGraph } from './UnweightedGraph';
import { WeightedGraph } from './WeightedGraph';
import { GraphState } from '../context/graphSlice'
import { KEYWORD } from 'color-convert/conversions';

// undefined: không quan trọng
// true: phải có
// false: không được có
export interface AlgorithmRequirements
{
    directed?: boolean;
    weighted?: boolean; // nếu không cần trọng số thì thuật toán cũng sẽ thực hiện được với đồ thị có trọng số
    acyclic?: boolean;
}

export abstract class GraphAlgorithm<Config = object>
{
    public abstract get name(): string;
    public abstract defaultConfig(): Config;

    public get code(): string | string[]
    {
        return '';
    }

    public get predicate(): AlgorithmRequirements
    {
        return { };
    }

    public configNode(): ReactNode
    {
        return (<></>);
    }
    
    public abstract run(g: GraphState, config: Config): IterableIterator<AlgorithmStep>;
};

export abstract class NeutralGraphAlgorithm<Config = object> extends GraphAlgorithm<Config>
{
    protected abstract _run(g: UnweightedGraph, config: Config): IterableIterator<AlgorithmStep>;

    public run(g: GraphState, config: Config): IterableIterator<AlgorithmStep>
    {
        const graph = new UnweightedGraph(g.vertexCount, g.directed);

        for (const edge of g.edges)
        {
            graph.addEdge(edge);
        }

        return this._run(graph, config);
    }
}

export abstract class WeightedGraphAlgorithm<Config = object> extends GraphAlgorithm<Config>
{
    public override get predicate(): AlgorithmRequirements 
    {
        return { weighted: true };
    }

    protected abstract _run(g: WeightedGraph, config: Config): IterableIterator<AlgorithmStep>;

    public run(g: GraphState, config: Config): IterableIterator<AlgorithmStep>
    {
        const graph = new WeightedGraph(g.vertexCount, g.directed);

        if (!g.weighted)
        {
            throw new Error();
        }

        for (const edge of g.edges)
        {
            graph.addEdge(edge);
        }

        return this._run(graph, config);
    }
}

export type ColorVertexAnimation = [vertex: number, color: KEYWORD];
export type ColorEdgeAnimation = [u: number, v: number, color: KEYWORD];
export type HighlightVertexAnimation = [vertex: number, highlight: boolean];
export type HighlightEdgeAnimation = [u: number, v: number, highlight: boolean];
type ArrayOrSingle<T> = T | T[];

export interface AlgorithmStep
{
    log: string;
    
    colorVertex?: ArrayOrSingle<ColorVertexAnimation>;
    colorEdge?: ArrayOrSingle<ColorEdgeAnimation>;

    highlightVertex?: ArrayOrSingle<HighlightVertexAnimation>;
    highlightEdge?: ArrayOrSingle<HighlightEdgeAnimation>;

    codeLine?: number;
}

export const MustBeUndirectedError = 'Đồ thị phải là đồ thị vô hướng';
export const MustBeDirectedError = 'Đồ thị phải là đồ thị có hướng';
export const MustBeDAGError = 'Đồ thị phải là đồ thị không chu trình có hướng';
export const MustBeWeightedError = 'Đồ thị phải là đồ thị có trọng số';