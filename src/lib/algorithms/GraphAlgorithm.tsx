import { ReactNode } from 'react';
import GraphAnimator from '../animation/GraphAnimator';
import GraphType from '../graphs/Graph';
import PseudocodeAnimator from '../animation/PseudocodeAnimator';
import { PseudocodeLine } from '../pseudocode/Pseudocode';
import WeightedGraph from '../graphs/weighted/WeightedGraph';

// undefined: không quan trọng
// true: phải có
// false: không được có
export interface AlgorithmRequirements
{
    directed?: boolean;
    weighted?: boolean; // nếu không cần trọng số thì thuật toán cũng sẽ thực hiện được với đồ thị có trọng số
    acyclic?: boolean;
}

export abstract class GraphAlgorithm<Graph extends GraphType = GraphType, Config = object>
{
    public abstract get name(): string;
    public abstract get pseudocode(): PseudocodeLine[];
    public abstract get predicate(): AlgorithmRequirements;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public configNode(_vertexCount: number): ReactNode
    {
        return (<></>);
    }
    
    public abstract run(g: Graph, config: Config): IterableIterator<AlgorithmStep>;
};

export abstract class NeutralGraphAlgorithm<Config> extends GraphAlgorithm<GraphType, Config>
{
    public override get predicate(): AlgorithmRequirements 
    {
        return { };
    }
}

export abstract class WeightedGraphAlgorithm<Graph extends WeightedGraph, Config = object> extends GraphAlgorithm<Graph, Config>
{
    public override get predicate(): AlgorithmRequirements 
    {
        return { weighted: true };
    }
}

export interface AlgorithmStep
{
    // description: string;
    animate?: (animator: GraphAnimator) => void;
    pseudocode?: (animator: PseudocodeAnimator) => void;
    // pseudoText: () => void;
}

export const MustBeUndirectedError = 'Đồ thị phải là đồ thị vô hướng';
export const MustBeDirectedError = 'Đồ thị phải là đồ thị có hướng';
export const MustBeDAGError = 'Đồ thị phải là đồ thị không chu trình có hướng';
export const MustBeWeightedError = 'Đồ thị phải là đồ thị có trọng số';