import { memo, ReactNode } from 'react';
import { UnweightedGraph } from './UnweightedGraph';
import { WeightedGraph } from './WeightedGraph';
import { GraphState } from '../context/graphSlice'
import { KEYWORD } from 'color-convert/conversions';
import cytoscape from 'cytoscape';

// undefined: không quan trọng
// true: phải có
// false: không được có
export interface AlgorithmRequirements {
    directed?: boolean;
    weighted?: boolean; // nếu không cần trọng số thì thuật toán cũng sẽ thực hiện được với đồ thị có trọng số
    acyclic?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class GraphAlgorithm<Config = object, R = any>
{
    public abstract get name(): string;
    public abstract defaultConfig(): Config;
    protected abstract _result(result: R): ReactNode;

    public get Result(): React.FC<{ result: R }>
    {
        return memo((props: { result: R }) => this._result(props.result));
    }

    public get code(): string | string[]
    {
        return '';
    }

    public get predicate(): AlgorithmRequirements {
        return {};
    }

    public configNode(): ReactNode {
        return <></>;
    }
    
    public abstract run(g: GraphState, config: Config): [IterableIterator<AlgorithmStep>, R];
};

export abstract class NeutralGraphAlgorithm<Config, R> extends GraphAlgorithm<Config, R>
{
    protected abstract _run(g: UnweightedGraph, config: Config, result: R): IterableIterator<AlgorithmStep>;

    protected abstract _initResult(): R;

    public run(g: GraphState, config: Config): [IterableIterator<AlgorithmStep>, R]
    {
        const graph = new UnweightedGraph(g.vertexCount, g.directed);

        for (const edge of g.edges) {
            graph.addEdge(edge);
        }
        
        const result = this._initResult();
        return [this._run(graph, config, result), result];
    }
}

export abstract class WeightedGraphAlgorithm<Config, R> extends GraphAlgorithm<Config, R>
{
    public override get predicate(): AlgorithmRequirements 
    {
        return { weighted: true };
    }

    protected abstract _initResult(): R;

    protected abstract _run(g: WeightedGraph, config: Config, result: R): IterableIterator<AlgorithmStep>;

    public run(g: GraphState, config: Config): [IterableIterator<AlgorithmStep>, R]
    {
        const graph = new WeightedGraph(g.vertexCount, g.directed);

        if (!g.weighted) {
            throw new Error();
        }

        for (const edge of g.edges) {
            graph.addEdge(edge);
        }

        const result = this._initResult();
        return [this._run(graph, config, result), result];
    }
}

export type ColorVertexAnimation = [vertex: number, color: KEYWORD];
export type ColorEdgeAnimation = [u: number, v: number, color: KEYWORD];
export type HighlightVertexAnimation = [vertex: number, highlight: boolean];
export type HighlightEdgeAnimation = [u: number, v: number, highlight: boolean];
export type BackgourndColorVertex = [vertex: number, backgroundColor: KEYWORD];
export type BorderColorVertex = [vertex: number, color: KEYWORD];
export type ContentColorVertex = [vertex: number, color: KEYWORD];
type ArrayOrSingle<T> = T | T[];

export interface AlgorithmStep
{
    log: string;
    
    colorVertex?: ArrayOrSingle<ColorVertexAnimation>;
    colorEdge?: ArrayOrSingle<ColorEdgeAnimation>;
    backgroundColorVertex?: ArrayOrSingle<BackgourndColorVertex>;

    highlightVertex?: ArrayOrSingle<HighlightVertexAnimation>;
    highlightEdge?: ArrayOrSingle<HighlightEdgeAnimation>;

    borderColorVertex?: ArrayOrSingle<BorderColorVertex>;
    contentColorVertex?: ArrayOrSingle<ContentColorVertex>;

    reset?: boolean;

    labelEdge?: ArrayOrSingle<[u: number, v: number, label: string]>;

    customGraph?: (core: cytoscape.Core) => void;

    codeLine?: number | [number, number];
}

export const MustBeUndirectedError = "Đồ thị phải là đồ thị vô hướng";
export const MustBeDirectedError = "Đồ thị phải là đồ thị có hướng";
export const MustBeDAGError = "Đồ thị phải là đồ thị không chu trình có hướng";
export const MustBeWeightedError = "Đồ thị phải là đồ thị có trọng số";
