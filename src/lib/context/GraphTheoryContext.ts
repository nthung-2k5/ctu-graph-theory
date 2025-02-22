import { createContext, useContext } from 'react';
import { GraphAlgorithm } from '../algorithms/GraphAlgorithm';

export const GraphTheoryContext = createContext<{
    algorithm: GraphAlgorithm,
    setAlgorithm: (algo: GraphAlgorithm) => void,
}>(null!);

export const useGraphTheory = () =>
{
    return useContext(GraphTheoryContext);
}