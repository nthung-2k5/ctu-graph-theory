import { describe, expect, test } from "bun:test";
import Edge from '../src/lib/graphs/unweighted/Edge';
import EdgeList from '../src/lib/graphs/unweighted/EdgeList';
import AdjacencyMatrix from '../src/lib/graphs/unweighted/AdjacencyMatrix';
import AdjacencyList from '../src/lib/graphs/unweighted/AdjacencyList';
import IncidenceMatrix from '../src/lib/graphs/unweighted/IncidenceMatrix';
import UnweightedGraph from '../src/lib/graphs/unweighted/UnweightedGraph';
import GraphTestResult from './GraphTestResult';
import GraphConverter from '../src/lib/graphs/unweighted/GraphConverter';

interface TestCase<Result>
{
    n: number;
    edges: Edge[];

    result: GraphTestResult<Result>;
}

const neighborsTestCase: TestCase<number[]>[] = [
    {
        n: 4,
        edges: [
            { u: 1, v: 3 },
            { u: 4, v: 1 },
            { u: 3, v: 3 }
        ],

        result: new GraphTestResult({
            undirected: {
                1: [3, 4],
                2: [],
                3: [1, 3],
                4: [1]
            },
            directed: {
                1: [3],
                2: [],
                3: [3],
                4: [1]
            },
        })
    },
    {
        n: 4,
        edges: [
            { u: 1, v: 1 },
            { u: 2, v: 2 },
            { u: 2, v: 4 },
            { u: 3, v: 4 },
            { u: 3, v: 2 },
        ],
        result: new GraphTestResult({
            undirected: {
                1: [1],
                2: [2, 3, 4],
                3: [2, 4],
                4: [2, 3]
            },
            directed: {
                1: [1],
                2: [2, 4],
                3: [2, 4],
                4: []
            },
        })
    },
    {
        n: 4,
        edges: [
            { u: 3, v: 1 },
            { u: 2, v: 4 },
            { u: 4, v: 2 },
        ],
        result: new GraphTestResult({
            undirected: {
                1: [3],
                2: [4],
                3: [1],
                4: [2]
            },
            directed: {
                1: [],
                2: [4],
                3: [1],
                4: [2]
            },
        })
    },
    {
        n: 6,
        edges: [
            { u: 3, v: 1 },
            { u: 2, v: 4 },
            { u: 4, v: 2 },
            { u: 2, v: 3 },
            { u: 4, v: 6 },
            { u: 5, v: 5 },
            { u: 5, v: 5 },
            { u: 6, v: 4 },
        ],
        result: new GraphTestResult({
            undirected: {
                1: [3],
                2: [3, 4],
                3: [1, 2],
                4: [2, 6],
                5: [5],
                6: [4]
            },
            directed: {
                1: [],
                2: [3, 4],
                3: [1],
                4: [2, 6],
                5: [5],
                6: [4]
            },
        })
    },
];

const degreeTestCase: TestCase<number>[] = [
    {
        n: 4,
        edges: [
            { u: 1, v: 3 },
            { u: 4, v: 2 },
            { u: 3, v: 1 },
            { u: 1, v: 1 },
        ],

        result: new GraphTestResult({
            undirected: {
                1: 4,
                2: 1,
                3: 2,
                4: 1
            },
            directed: {
                1: 4,
                2: 1,
                3: 2,
                4: 1,                
            },
        })
    },
    {
        n: 4,
        edges: [
            { u: 1, v: 3 },
            { u: 4, v: 1 },
            { u: 1, v: 4 },
            { u: 3, v: 2 },
            { u: 4, v: 1 },
        ],
        result: new GraphTestResult({
            undirected: {
                1: 4,
                2: 1,
                3: 2,
                4: 3,
            },
            directed: {
                1: 4,
                2: 1,
                3: 2,
                4: 3,
            },
        })
    },
    {
        n: 4,
        edges: [
            { u: 1, v: 3 },
            { u: 3, v: 3 },
            { u: 4, v: 1 },
            { u: 3, v: 3 },
            { u: 3, v: 2 },
            { u: 2, v: 3 },
            { u: 3, v: 3 },
        ],
        result: new GraphTestResult({
            undirected: {
                1: 2,
                2: 2,
                3: 9,
                4: 1,
            },
            directed: {
                1: 2,
                2: 2,
                3: 9,
                4: 1,                
            },
        })
    },
    {
        n: 6,
        edges: [
            { u: 3, v: 1 },
            { u: 2, v: 4 },
            { u: 2, v: 3 },
            { u: 5, v: 6 },
            { u: 6, v: 5 },
            { u: 1, v: 6 },
            { u: 6, v: 3 },
            { u: 4, v: 5 },
            { u: 6, v: 5 },
        ],
        result: new GraphTestResult({
            undirected: {
                1: 2,
                2: 2,
                3: 3,
                4: 2,
                5: 4,
                6: 5,
            },
            directed: {
                1: 2,
                2: 2,
                3: 3,
                4: 2,
                5: 4,
                6: 5,                
            },
        })
    },
];

describe("Unweighted graph tests", () =>
{
    describe("Undirected", () =>
    {
        allGraphNeighborsTest(false);
        allGraphDegreeTest(false);
    });

    describe("Directed", () =>
    {
        allGraphNeighborsTest(true);
        allGraphDegreeTest(true);
    });

    test("Conversion", () =>
    {
        const edgesCases = neighborsTestCase.map(testCase => ({ n : testCase.n, edges: testCase.edges })).concat(degreeTestCase.map(testCase => ({ n : testCase.n, edges: testCase.edges })));
        
        for (const testCase of edgesCases)
        {
            let graph: UnweightedGraph = new EdgeList(testCase.n, false);
            graph = populateGraph(graph, testCase.edges);
            expect(GraphConverter.toAdjacencyMatrix(graph).equals(graph)).toBe(true);
            expect(GraphConverter.toAdjacencyList(graph).equals(graph)).toBe(true);
            expect(GraphConverter.toIncidenceMatrix(graph).equals(graph)).toBe(true);

            graph = new AdjacencyMatrix(testCase.n, false);
            graph = populateGraph(graph, testCase.edges);
            expect(GraphConverter.toEdgeList(graph).equals(graph)).toBe(true);
            expect(GraphConverter.toAdjacencyList(graph).equals(graph)).toBe(true);
            expect(GraphConverter.toIncidenceMatrix(graph).equals(graph)).toBe(true);

            graph = new AdjacencyList(testCase.n, false);
            graph = populateGraph(graph, testCase.edges);
            expect(GraphConverter.toEdgeList(graph).equals(graph)).toBe(true);
            expect(GraphConverter.toAdjacencyMatrix(graph).equals(graph)).toBe(true);
            expect(GraphConverter.toIncidenceMatrix(graph).equals(graph)).toBe(true);

            graph = new IncidenceMatrix(testCase.n, false);
            graph = populateGraph(graph, testCase.edges);
            expect(GraphConverter.toEdgeList(graph).equals(graph)).toBe(true);
            expect(GraphConverter.toAdjacencyMatrix(graph).equals(graph)).toBe(true);
            expect(GraphConverter.toAdjacencyList(graph).equals(graph)).toBe(true);
        }
    })
});

function populateGraph(graph: UnweightedGraph, edges: Edge[]): UnweightedGraph
{
    for (const edge of edges) 
    {
        graph.addEdge(edge);
    }

    return graph;
};

function generateTest<Graph extends UnweightedGraph>(type: { new(n: number, directed: boolean): Graph ;}, n: number, edges: Edge[], directed: boolean, vertexTest: (graph: Graph, u: number) => void)
{
    const graph = new type(n, directed);
    populateGraph(graph, edges);

    for (let u = 1; u <= graph.vertexCount; u++) 
    {
        vertexTest(graph, u);
    }
}

function neighborsTest<Graph extends UnweightedGraph>(type: { new(n: number, directed: boolean): Graph ;}, testCase: TestCase<number[]>, directed: boolean)
{
    generateTest(type, testCase.n, testCase.edges, directed, (graph, u) =>
    {
        expect(graph.neighbors(u)).toEqual(testCase.result.get(u, directed));
    });
}

function degreeTest<Graph extends UnweightedGraph>(type: { new(n: number, directed: boolean): Graph ;}, testCase: TestCase<number>, directed: boolean)
{
    generateTest(type, testCase.n, testCase.edges, directed, (graph, u) =>
    {
        expect(graph.degree(u)).toEqual(testCase.result.get(u, directed));
    });
}

function allGraphNeighborsTest(directed: boolean)
{
    describe("Neighbors Test", () =>
    {
        test.each(neighborsTestCase)("Edge list (case %#)", (testCase) =>
        {
            neighborsTest(EdgeList, testCase, directed);
        });

        test.each(neighborsTestCase)("Adjacency matrix (case %#)", (testCase) =>
        {
            neighborsTest(AdjacencyMatrix, testCase, directed);
        });

        test.each(neighborsTestCase)("Adjacency list (case %#)", (testCase) =>
        {
            neighborsTest(AdjacencyList, testCase, directed);
        });

        test.each(neighborsTestCase)("Incidence matrix (case %#)", (testCase) =>
        {
            neighborsTest(IncidenceMatrix, testCase, directed);
        });
    });
}

function allGraphDegreeTest(directed: boolean)
{
    describe("Degree Test", () =>
    {
        test.each(degreeTestCase)("Edge list (case %#)", (testCase) =>
        {
            degreeTest(EdgeList, testCase, directed);
        });

        test.each(degreeTestCase)("Adjacency matrix (case %#)", (testCase) =>
        {
            degreeTest(AdjacencyMatrix, testCase, directed);
        });

        test.each(degreeTestCase)("Adjacency list (case %#)", (testCase) =>
        {
            degreeTest(AdjacencyList, testCase, directed);
        });

        test.each(degreeTestCase)("Incidence matrix (case %#)", (testCase) =>
        {
            degreeTest(IncidenceMatrix, testCase, directed);
        });
    });
}