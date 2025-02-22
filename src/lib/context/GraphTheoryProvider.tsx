import React, { PropsWithChildren, useState } from 'react';
import { GraphAlgorithm } from '../algorithms/GraphAlgorithm';
import { GraphTheoryContext } from './GraphTheoryContext';
import Bipartite from '../algorithms/connectivity/Bipartite';
import Cycle from '../algorithms/connectivity/Cycle';
import BFS from '../algorithms/traversal/BFS';
import RecursionDFS from '../algorithms/traversal/RecursionDFS';
import StackDFS from '../algorithms/traversal/StackDFS';
import UndirectedConnected from '../algorithms/connectivity/UndirectedConnected';

export const AvailableAlgorithms = [
    new BFS(),
    new RecursionDFS(),
    new StackDFS(),
    new UndirectedConnected(),
    new Cycle(),
    new Bipartite(),
];

export const GraphTheoryProvider: React.FC<PropsWithChildren> = ({ children }) =>
{
    const [algorithm, setAlgorithm] = useState<GraphAlgorithm>(AvailableAlgorithms[0]);
    
    return (
        <GraphTheoryContext.Provider value={{ algorithm, setAlgorithm }}>
            {children}
        </GraphTheoryContext.Provider>
    );
}