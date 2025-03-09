import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { AlgorithmStep, GraphAlgorithm } from '../algorithms/GraphAlgorithm';
import { GraphTheoryContext } from './GraphTheoryContext';
import Bipartite from '../algorithms/connectivity/Bipartite';
import BFS from '../algorithms/traversal/BFS';
import RecursionDFS from '../algorithms/traversal/RecursionDFS';
import StackDFS from '../algorithms/traversal/StackDFS';
import { useAppSelector } from './hooks';
import TarjanAlgorithm from '../algorithms/connectivity/Tarjan';

export const AvailableAlgorithms = [
    new BFS(),
    new RecursionDFS(),
    new StackDFS(),
    new Bipartite(),
    new TarjanAlgorithm()
];

export const GraphTheoryProvider: React.FC<PropsWithChildren> = ({ children }) =>
{
    const graphState = useAppSelector(state => state.graph);
    const [algorithm, setAlgorithm] = useState<GraphAlgorithm>(AvailableAlgorithms[0]);
    const [config, setConfig] = useState<object | null>({});
    const [steps, setSteps] = useState<AlgorithmStep[]>([]);
    const [result, setResult] = useState<unknown | null>(null);

    const error = useMemo(() => 
    {
        const predicate = algorithm.predicate;
    
        if (graphState.vertexCount === 0)
        {
            setConfig(null);
            return 'Đồ thị không được rỗng';
        }
    
        if (predicate.directed !== undefined && predicate.directed !== graphState.directed) 
        {
            setConfig(null);
            return `Đồ thị phải là đồ thị ${ predicate.directed ? "có" : "vô" } hướng`;
        }

        if (predicate.weighted !== undefined && predicate.weighted !== graphState.weighted)
        {
            setConfig(null);
            return `Đồ thị phải ${ predicate.weighted ? "có" : "không" } trọng số`;
        }
    
        // TODO: Check for acyclic graph
        // if (predicate.acyclic !== undefined && predicate.acyclic !== edges.acyclic) 
        // {
        //     return { valid: false, error: `Đồ thị không được có chu trình` };
        // }
    
        setConfig(algorithm.defaultConfig());
        return null;
    }, [algorithm, graphState.directed, graphState.vertexCount, graphState.weighted]);
    
    useEffect(() =>
    {
        if (config !== null)
        {
            const [steps, result] = algorithm.run(graphState, config);
            setSteps(Array.from(steps));
            setResult(result);
        }
        else
        {
            setSteps([]);
            setResult(null);
        }
    }, [algorithm, graphState.edges, graphState.directed, graphState.weighted, config, graphState]);

    return (
        <GraphTheoryContext.Provider value={{algorithm, setAlgorithm, config, setConfig, animationSteps: steps, result, predicateError: error}}>
            {children}
        </GraphTheoryContext.Provider>
    );
}