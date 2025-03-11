import { createContext, useContext } from 'react';
import { AlgorithmStep, GraphAlgorithm } from '../algorithms/GraphAlgorithm';

export const GraphTheoryContext = createContext<{
    algorithm: GraphAlgorithm,
    setAlgorithm: (algo: GraphAlgorithm) => void,

    config: object | null,
    setConfig: (config: object) => void,

    predicateError: string | null,

    animationSteps: AlgorithmStep[],
    result: unknown | null,
}>(null!);

export const useGraphTheory = () =>
{
    return useContext(GraphTheoryContext);
}