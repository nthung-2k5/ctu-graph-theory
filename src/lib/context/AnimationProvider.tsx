import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { AnimationContext } from './AnimationContext';
import { useGraphTheory } from './GraphTheoryContext';
import { AlgorithmStep } from '../algorithms/GraphAlgorithm';
import GraphAnimator from '../animation/GraphAnimator';
import PseudocodeAnimator from '../animation/PseudocodeAnimator';
import React from 'react';
import LogAnimator from '../animation/LogAnimator';
function singleToArray<T>(value: T | T[]): T[]
{
    if (Array.isArray(value) && !Array.isArray(value[0]))
    {
        return [value] as T[];
    }

    return value as T[];
}

function useStateAndRef<T>(initial: T)
{
    const [state, setState] = useState(initial);
    const ref = useRef(state);

    useEffect(() =>
    {
        ref.current = state;
    }, [state]);

    return [state, setState, ref] as const;
}

export const AnimationProvider: React.FC<PropsWithChildren> = ({ children }) =>
{
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed, speedRef] = useStateAndRef(2);
    const [cursor, setCursor, cursorRef] = useStateAndRef(0);

    const setCursorTo = (newCursor: number) =>
    {
        if (cursorRef.current < newCursor)
        {
            forward(newCursor - cursorRef.current);
        }
        else if (cursorRef.current > newCursor)
        {
            rewind(cursor - newCursor);
        }
    }

    const { animationSteps: steps } = useGraphTheory();
    const timeout = useRef<number | null>(null);
    const animator = useRef({
        graph: new GraphAnimator(),
        pseudocode: new PseudocodeAnimator(),
        log: new LogAnimator()
    });

    useEffect(() =>
    {
        setCursor(0);
        reset();
    }, [steps, setCursor]);

    const animate = (step: AlgorithmStep) =>
    {
        if (step.colorVertex)
        {
            const colorVertices = singleToArray(step.colorVertex);
            colorVertices.forEach(([vertex, color]) => animator.current.graph.colorVertex(vertex, color));
        }

        if (step.backgroundColorVertex) 
        {
            const colorVertices = singleToArray(step.backgroundColorVertex);
            colorVertices.forEach(([vertex, color]) => animator.current.graph.backgroundColorVertex(vertex, color));
        }

        if (step.contentColorVertex) 
        {
            const colorVertices = singleToArray(step.contentColorVertex);
            colorVertices.forEach(([vertex, color]) => animator.current.graph.contentColorVertex(vertex, color));
        }

        if (step.borderColorVertex)
        {
            const colorVertices = singleToArray(step.borderColorVertex);
            colorVertices.forEach(([vertex, color]) => animator.current.graph.borderColorVertex(vertex, color));
        }
    
        if (step.colorEdge)
        {
            const colorEdges = singleToArray(step.colorEdge);
            colorEdges.forEach(([u, v, color]) => animator.current.graph.colorEdge(u, v, color));
        }
    
        if (step.highlightEdge)
        {
            const highlightEdges = singleToArray(step.highlightEdge);
            highlightEdges.forEach(([u, v, highlight]) => (highlight ? animator.current.graph.highlightEdge : animator.current.graph.unhighlightEdge).apply(animator.current.graph, [u, v]));
        }
    
        if (step.highlightVertex)
        {
            const highlightVertices = singleToArray(step.highlightVertex);
            highlightVertices.forEach(([vertex, highlight]) => (highlight ? animator.current.graph.highlightVertex : animator.current.graph.unhighlightVertex).apply(animator.current.graph, [vertex]));
        }

        if (step.labelEdge)
        {
            const labelEdges = singleToArray(step.labelEdge);
            labelEdges.forEach(([u, v, label]) => animator.current.graph.labelEdge(u, v, label));
        }
    
        if (step.codeLine !== undefined)
        {
            animator.current.pseudocode.currentLine = step.codeLine;
        }

        if (step.log)
        {
            animator.current.log.addLog(step.log);
        }

        if (step.customGraph)
        {
            animator.current.graph.customAction(step.customGraph);
        }

        if (step.reset) 
        {
            animator.current.graph.reset();
        }
    }

    const reset = () =>
    {
        animator.current.graph.reset();
        animator.current.pseudocode.reset();
        animator.current.log.clearLogs();
    };

    const pause = () => 
    {
        if (timeout.current)
        {
            window.clearTimeout(timeout.current);
            timeout.current = null;
            setPlaying(false);
        }
    };

    const forward = (by: number = 1) => 
    {
        pause();
        by = Math.min(by, steps.length - cursorRef.current);
        if (by === 0)
        {
            return false;
        }
        
        for (let i = 0; i < by; i++)
        {
            animate(steps[cursorRef.current + i]);
        }

        setCursor(cursor => cursor + by);
        return true;
    };

    const rewind = (by: number = 1) => 
    {
        pause();
        by = Math.min(by, cursorRef.current);
        if (by === 0)
        {
            return false;
        }

        reset();
        for (let i = 0; i < cursorRef.current - by; i++)
        {
            animate(steps[i]);
        }

        setCursor(cursor => cursor - by);
        return true;
    };

    const resume = (first: boolean = false) => 
    {
        pause();
        
        if (forward() || first)
        {
            if (first) setCursorTo(0);
            const interval = 4000 / Math.pow(Math.E, speedRef.current);
            timeout.current = window.setTimeout(resume, interval);
            setPlaying(true);
        }
    }

    return (
        <AnimationContext.Provider value={{
            playing,
            resume: () => resume(cursor === steps.length),
            pause,
            forward: () => forward(),
            rewind: () => rewind(),
            cursor, setCursor: setCursorTo,
            steps: steps.length,
            speed, setSpeed,
            graph: animator.current.graph,
            code: animator.current.pseudocode,
            log: animator.current.log
        }}>
            {children}
        </AnimationContext.Provider>
    )
}