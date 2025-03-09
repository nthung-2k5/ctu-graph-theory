import React, { PropsWithChildren, useMemo, useState } from 'react';
import { GraphAlgorithm } from '../algorithms/GraphAlgorithm';
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
    const [config, setConfig] = useState({});
    
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
    
        setConfig(algorithm.defaultConfig());
        return null;
    }, [algorithm, graphState.directed, graphState.vertexCount, graphState.weighted]);

    return (
        <GraphTheoryContext.Provider value={{algorithm, setAlgorithm, config, setConfig, predicateError: error}}>
            {children}
        </GraphTheoryContext.Provider>
    );
}