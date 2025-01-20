import { ReactNode } from 'react';
import UnweightedGraph from '../UnweightedGraph';

export abstract class GraphAlgorithm
{
    public abstract get name(): string;
    public abstract predicateCheck(g: UnweightedGraph): { valid: boolean, errors?: string[] };
    public abstract run(g: UnweightedGraph): IterableIterator<AlgorithmStep>;
};

export abstract class ConfigGraphAlgorithm<Config>
{
    public abstract get name(): string;
    public abstract get configNode(): ReactNode;
    public abstract predicateCheck(g: UnweightedGraph): { valid: boolean, errors?: string[] };
    public abstract run(g: UnweightedGraph, conf: Config): IterableIterator<AlgorithmStep>;
};

export interface AlgorithmStep
{
    description: string;
    graphInteraction?: () => void;
}

export const MustBeDirectedError = 'Đồ thị phải là đồ thị có hướng';
export const MustBeWeightedError = 'Đồ thị phải là đồ thị có trọng số';