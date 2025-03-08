import { createContext, useContext } from 'react';
import GraphAnimator from '../animation/GraphAnimator';
import PseudocodeAnimator from '../animation/PseudocodeAnimator';
import LogAnimator from '../animation/LogAnimator';

export const AnimationContext = createContext<{
    playing: boolean,

    resume: () => void,
    pause: () => void,
    forward: () => void,
    rewind: () => void,

    steps: number,

    cursor: number,
    setCursor: (cursor: number) => void,

    speed: number,
    setSpeed: (speed: number) => void,

    graph: GraphAnimator,
    code: PseudocodeAnimator,
    log: LogAnimator
}>(null!);

export const useAnimation = () =>
{
    return useContext(AnimationContext);
}