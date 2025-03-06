import React, { PropsWithChildren, useMemo, useRef, useState } from 'react';
import { GraphAlgorithm } from '../algorithms/GraphAlgorithm';
import { GraphTheoryContext } from './GraphTheoryContext';
import Bipartite from '../algorithms/connectivity/Bipartite';
import Cycle from '../algorithms/connectivity/Cycle';
import BFS from '../algorithms/traversal/BFS';
import RecursionDFS from '../algorithms/traversal/RecursionDFS';
import StackDFS from '../algorithms/traversal/StackDFS';
import UndirectedConnected from '../algorithms/connectivity/UndirectedConnected';
import Animator, { AnimationState } from '../animation/Animator';
import { useAppSelector } from './hooks';
import TopoOrderingBFS from '../algorithms/topological/TopoOrderingBFS';

export const AvailableAlgorithms = [
    new BFS(),
    new RecursionDFS(),
    new StackDFS(),
    new UndirectedConnected(),
    new Cycle(),
    new Bipartite(),
    new TopoOrderingBFS()
];

export const GraphTheoryProvider: React.FC<PropsWithChildren> = ({ children }) =>
{
    const graphState = useAppSelector(state => state.graph);
    const [algorithm, setAlgorithm] = useState<GraphAlgorithm>(AvailableAlgorithms[0]);
    const animator = useRef(new Animator());
    const [speed, setSpeed] = useState(1);
    const config = useRef({});

    animator.current.setOnAnimationStateChanged(() =>
    {
        setPlaying(animator.current.playing);
        setPaused(animator.current.paused);
    });
    
    const error = useMemo(() => 
    {
        const predicate = algorithm.predicate;
    
        if (graphState.vertexCount === 0)
        {
            return 'Đồ thị không được rỗng';
        }
    
        if (predicate.directed !== undefined && predicate.directed !== graphState.directed) 
        {
            return `Đồ thị phải là đồ thị ${ predicate.directed ? "có" : "vô" } hướng`;
        }

        if (predicate.weighted !== undefined && predicate.weighted !== graphState.weighted)
        {
            return `Đồ thị phải ${ predicate.weighted ? "có" : "không" } trọng số`;
        }
    
        // TODO: Check for acyclic graph
        // if (predicate.acyclic !== undefined && predicate.acyclic !== edges.acyclic) 
        // {
        //     return { valid: false, error: `Đồ thị không được có chu trình` };
        // }
    
        return null;
            
    }, [algorithm, graphState.directed, graphState.vertexCount, graphState.weighted]);

    const [playing, setPlaying] = useState(false);
    const [paused, setPaused] = useState(false);

    return (
        <GraphTheoryContext.Provider value={{
            algorithm,
            setAlgorithm,
            animator: animator.current,
            speed,
            setSpeed: (value) =>
            {
                animator.current.setSpeed(value);
                setSpeed(value);
            },
            config,
            predicateError: error,
            playing,
            paused,
            play: () =>
            {
                const state = animator.current.state;
                switch (state)
                {
                    case AnimationState.PAUSED:
                        animator.current.resume();
                        break;
                    case AnimationState.STOPPED:
                        console.log(animator.current);
                        animator.current.play(algorithm.run(graphState, config.current, animator.current));
                        break;
                }
            },
            pause: () => animator.current.pause(),
            stop: () => animator.current.stop(),
            fastForward: () => animator.current.fastForward(),
            rewind: () =>
            {
                animator.current.stop();
                animator.current.play(algorithm.run(graphState, config.current, animator.current));
            }
        }}>
            {children}
        </GraphTheoryContext.Provider>
    );
}
