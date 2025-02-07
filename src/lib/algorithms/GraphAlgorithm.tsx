import { ReactNode } from 'react';
// import UnweightedGraph from '../graphs/unweighted/UnweightedGraph';
import GraphAnimator from '../GraphAnimator';
import Graph from '../graphs/Graph';

export abstract class GraphAlgorithm<Config = object>
{
    public abstract get name(): string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public configNode(_graph: Graph): ReactNode
    {
        return (<></>);
    }
    
    public abstract predicateCheck(g: Graph): { valid: boolean, errors?: string[] };
    public abstract run(g: Graph, config: Config): IterableIterator<AlgorithmStep>;
};

// export abstract class ConfigGraphAlgorithm<Config>
// {
//     public abstract get name(): string;
//     public abstract get configNode(): ReactNode;
//     public abstract predicateCheck(g: Graph): { valid: boolean, errors?: string[] };
//     public abstract run(g: Graph, conf: Config): IterableIterator<AlgorithmStep>;
// };

export interface AlgorithmStep
{
    // description: string;
    animate: (animator: GraphAnimator) => void;
    // pseudoText: () => void;
}

export const MustBeUndirectedError = 'Đồ thị phải là đồ thị vô hướng';
export const MustBeDirectedError = 'Đồ thị phải là đồ thị có hướng';
export const MustBeDAGError = 'Đồ thị phải là đồ thị không chu trình có hướng';
export const MustBeWeightedError = 'Đồ thị phải là đồ thị có trọng số';