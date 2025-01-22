import { createContext, MutableRefObject, useContext } from 'react';
import Graph from './graphs/Graph';
import GraphAnimator from './GraphAnimator';

export const GraphContext = createContext<{
    graph: Graph,
    setGraph: (g: Graph) => void,
    animator: MutableRefObject<GraphAnimator>,
    animating: boolean,
    setAnimating: (value: boolean) => void,
}>({ graph: null!, setGraph: () => {}, animator: null!, animating: false, setAnimating: () => {} });

export const useGraph = () =>
{
    return useContext(GraphContext);
}