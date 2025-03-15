<<<<<<< HEAD
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { AlgorithmStep, GraphAlgorithm } from "../algorithms/GraphAlgorithm";
import { GraphTheoryContext } from "./GraphTheoryContext";
import Bipartite from "../algorithms/connectivity/Bipartite";
import BFS from "../algorithms/traversal/BFS";
import RecursionDFS from "../algorithms/traversal/RecursionDFS";
import StackDFS from "../algorithms/traversal/StackDFS";
import { useAppSelector } from "./hooks";
import TopoOrderingBFS from "../algorithms/topological/TopoOrderingBFS";
import RankingGraph from "../algorithms/topological/RankingGraph";
import TarjanAlgorithm from "../algorithms/connectivity/Tarjan";
import Dijkstra from "../algorithms/shortest-path/Dijkstra";
import Bellman from "../algorithms/shortest-path/Bellman";
import Floyd from "../algorithms/shortest-path/Floyd";
=======
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { AlgorithmStep, GraphAlgorithm } from '../algorithms/GraphAlgorithm';
import { GraphTheoryContext } from './GraphTheoryContext';
import Bipartite from '../algorithms/connectivity/Bipartite';
import BFS from '../algorithms/traversal/BFS';
import RecursionDFS from '../algorithms/traversal/RecursionDFS';
import StackDFS from '../algorithms/traversal/StackDFS';
import { useAppSelector } from './hooks';
import TopoOrderingBFS from '../algorithms/topological/TopoOrderingBFS';
import RankingGraph from '../algorithms/topological/RankingGraph';
import TarjanAlgorithm from '../algorithms/connectivity/Tarjan';
import { GraphState } from './graphSlice';
import { UnweightedGraph } from '../algorithms/UnweightedGraph';
import { Queue } from 'data-structure-typed';
import Kruskal from '../algorithms/minimum_spanning_tree/kruskal';
>>>>>>> 7dac3109a4b159bf16eed75f0b114179357fb0dd

export const AvailableAlgorithms = [
    new BFS(),
    new RecursionDFS(),
    new StackDFS(),
    new Bipartite(),
    new TarjanAlgorithm(),
    new TopoOrderingBFS(),
    new RankingGraph(),
<<<<<<< HEAD
    new TarjanAlgorithm(),
    new Dijkstra(),
    new Floyd(),
    new Bellman(),
];

export const GraphTheoryProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const graphState = useAppSelector((state) => state.graph);
=======
    new Kruskal(),
];


/**
 * Checks if the graph is a Directed Acyclic Graph (DAG)
 * @param graphState The graph state
 * @returns true if the graph is a DAG, false otherwise
 */
function isDAG(graphState: GraphState): boolean 
{
    // If not directed, it's not a DAG
    if (!graphState.directed) 
    {
        return false;
    }

    const graph = new UnweightedGraph(graphState.vertexCount, false);
    for (const edge of graphState.edges) 
    {
        graph.addEdge(edge);
    }

    const visited = Array.from({ length: graphState.vertexCount + 1 }, () => 0);

    // DFS to detect cycles
    const hasCycle = (vertex: number): boolean => 
    {
        visited[vertex] = 1;

        for (const v of graph.neighbors(vertex)) 
        {
            if (visited[v] === 1) 
            {
                return true; // Cycle detected
            } 
            else if (visited[v] === 0 && hasCycle(v)) 
            {
                return true; // Cycle detected
            }
        }

        visited[vertex] = 2;
        return false;
    };

    // Check all vertices
    for (let v = 1; v <= graphState.vertexCount; v++) 
    {
        if (!visited[v] && hasCycle(v)) 
        {
            return false; // Contains cycle, not a DAG
        }
    }

    return true;
}

/**
 * Checks if the graph is connected
 * (for directed graphs, checks weak connectivity)
 * @param graphState The graph state
 * @returns true if the graph is connected, false otherwise
 */
function isConnectedGraph(graphState: GraphState): boolean 
{
    if (graphState.vertexCount === 0) return true;
  
    const graph = new UnweightedGraph(graphState.vertexCount, false);
    for (const edge of graphState.edges) 
    {
        graph.addEdge(edge);
    }

    // BFS to check connectivity
    const visited = Array.from({ length: graphState.vertexCount + 1 }, () => false);
    const queue = new Queue<number>([1]); // Start BFS from vertex 0
    visited[1] = true;

    while (queue.length > 0) 
    {
        const u = queue.shift()!;
    
        for (const v of graph.neighbors(u)) 
        {
            if (!visited[v]) 
            {
                visited[v] = true;
                queue.push(v);
            }
        }
    }

    // If all vertices are visited, the graph is connected
    return visited.every((v, i) => i == 0 || v);
}

export const GraphTheoryProvider: React.FC<PropsWithChildren> = ({ children }) =>
{
    const graphState = useAppSelector(state => state.graph);
>>>>>>> 7dac3109a4b159bf16eed75f0b114179357fb0dd
    const [algorithm, setAlgorithm] = useState<GraphAlgorithm>(AvailableAlgorithms[0]);
    const [config, setConfig] = useState<object | null>({});
    const [steps, setSteps] = useState<AlgorithmStep[]>([]);
    const [result, setResult] = useState<unknown | null>(null);

    const error = useMemo(() => {
        const predicate = algorithm.predicate;

        if (graphState.vertexCount === 0) {
            setConfig(null);
            return "Đồ thị không được rỗng";
        }

        if (predicate.directed !== undefined && predicate.directed !== graphState.directed) {
            setConfig(null);
            return `Đồ thị phải là đồ thị ${predicate.directed ? "có" : "vô"} hướng`;
        }

        if (predicate.weighted !== undefined && predicate.weighted !== graphState.weighted) {
            setConfig(null);
            return `Đồ thị phải ${predicate.weighted ? "có" : "không"} trọng số`;
        }

        // TODO: Check for acyclic graph
<<<<<<< HEAD
        // if (predicate.acyclic !== undefined && predicate.acyclic !== edges.acyclic)
        // {
        //     return { valid: false, error: `Đồ thị không được có chu trình` };
        // }

        setConfig(algorithm.defaultConfig());
        return null;
    }, [algorithm, graphState.directed, graphState.vertexCount, graphState.weighted]);

    useEffect(() => {
        if (config !== null) {
=======
        if (predicate.acyclic === true && !isDAG(graphState) && !isConnectedGraph(graphState)) 
        {
            setConfig(null);
            return `Đồ thị phải là đồ thị có hướng không chu trình và liên thông`;
        }
    
        setConfig(algorithm.defaultConfig());
        return null;
    }, [algorithm, graphState]);
    
    useEffect(() =>
    {
        if (config !== null)
        {
>>>>>>> 7dac3109a4b159bf16eed75f0b114179357fb0dd
            const [steps, result] = algorithm.run(graphState, config);
            setSteps(Array.from(steps));
            setResult(result);
        } else {
            setSteps([]);
            setResult(null);
        }
    }, [algorithm, graphState.edges, graphState.directed, graphState.weighted, config, graphState]);

    return (
        <GraphTheoryContext.Provider
            value={{ algorithm, setAlgorithm, config, setConfig, animationSteps: steps, result, predicateError: error }}
        >
            {children}
        </GraphTheoryContext.Provider>
    );
};
