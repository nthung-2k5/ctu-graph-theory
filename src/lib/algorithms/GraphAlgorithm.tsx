import { ReactNode } from 'react';
import GraphAnimator from '../animation/GraphAnimator';
import PseudocodeAnimator from '../animation/PseudocodeAnimator';
import { UnweightedGraph } from './UnweightedGraph';
import { WeightedGraph } from './WeightedGraph';
import { GraphState } from '../context/graphSlice';
import WeightedEdge from '../graphs/weighted/Edge';
import { PseudocodeLine } from '../pseudocode/Pseudocode';

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
    public get pseudocode(): PseudocodeLine[]
    {
        return [];
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
        const edges = g.edges as WeightedEdge[];

        for (const edge of edges)
        {
            graph.addEdge(edge);
        }

        return this._run(graph, config);
    }
}

export interface AlgorithmStep
{
    animate?: (animator: GraphAnimator) => void;
    pseudocode?: (animator: PseudocodeAnimator) => void;
}

export const MustBeUndirectedError = 'Đồ thị phải là đồ thị vô hướng';
export const MustBeDirectedError = 'Đồ thị phải là đồ thị có hướng';
export const MustBeDAGError = 'Đồ thị phải là đồ thị không chu trình có hướng';
export const MustBeWeightedError = 'Đồ thị phải là đồ thị có trọng số';