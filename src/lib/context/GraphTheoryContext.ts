import { createContext, MutableRefObject, useContext } from 'react';
import { GraphAlgorithm } from '../algorithms/GraphAlgorithm';
import Animator from '../animation/Animator';

export const GraphTheoryContext = createContext<{
    algorithm: GraphAlgorithm,
    setAlgorithm: (algo: GraphAlgorithm) => void,

    animator: Animator,
    config: MutableRefObject<object>,
    playing: boolean,
    paused: boolean,
    progress: number,

    predicateError: string | null,

    speed: number,
    setSpeed: (value: number) => void,
    
    play: () => void,
    pause: () => void,
    stop: () => void,
    fastForward: () => void,
    forward: () => void,
    rewind: () => void,
}>(null!);

export const useGraphTheory = () =>
{
    return useContext(GraphTheoryContext);
}