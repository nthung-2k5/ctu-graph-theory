import Edge from './Edge';
import Graph from '../Graph';
import { ElementDefinition } from 'cytoscape';
import { ReactNode } from 'react';

export default abstract class UnweightedGraph implements Graph
{
    private _directed: boolean;

    private _vertexCount: number;

    private _edgeCount: number = 0;

    get weighted(): boolean
    {
        return false;
    }

    get directed() 
    {
        return this._directed;
    }

    get vertexCount() 
    {
        return this._vertexCount;
    }

    get edgeCount() 
    {
        return this._edgeCount;
    }
    
    get edges()
    {
        const edgeSort = (a: Edge, b: Edge) => a.u - b.u || a.v - b.v;

        let edges = [...this._directed ? this._getEdgesDirected() : this._getEdgesUndirected()];
        if (!this.directed)
        {
            edges = edges.map(e => e.u > e.v ? { u: e.v, v: e.u } : e);
        }

        return edges.sort(edgeSort).map(({ u, v }) => ({ u: u + 1, v: v + 1 }));
    }

    protected abstract _getEdgesUndirected(): IterableIterator<Edge>;
    protected abstract _getEdgesDirected(): IterableIterator<Edge>;

    constructor(n: number = 0, directed: boolean = false) 
    {
        this._directed = directed;
        this._vertexCount = n;
    }

    toGraph(): ElementDefinition[]
    {
        const elements: ElementDefinition[] = [];

        for (let i = 1; i <= this._vertexCount; i++) 
        {
            elements.push({ group: 'nodes', data: { id: i.toString(), label: i.toString() } });
        }

        const edges = this.edges;
        for (let i = 0; i < edges.length; i++)
        {
            const edge = this.edges[i];
            elements.push({ group: 'edges', data: { id: `${edge.u}-${edge.v}[${i}]`, source: edge.u.toString(), target: edge.v.toString() }, classes: this._directed ? 'directed' : '' });
        }

        return elements;
    }

    abstract toMemoryGraph(): ReactNode;

    addEdge(e: Edge): void 
    {
        this._assertVertex(e.u);
        this._assertVertex(e.v);

        (this._directed ? this._addEdgeDirected : this._addEdgeUndirected).apply(this, [{ u: e.u - 1, v: e.v - 1 }]);
        this._edgeCount++;
    }

    protected abstract _addEdgeUndirected(e: Edge): void;
    protected abstract _addEdgeDirected(e: Edge): void;

    adjacent(u: number, v: number): boolean 
    {
        this._assertVertex(u);
        this._assertVertex(v);

        return (this._directed ? this._adjacentDirected : this._adjacentUndirected).apply(this, [u - 1, v - 1]);
    }

    protected abstract _adjacentUndirected(u: number, v: number): boolean;
    protected abstract _adjacentDirected(u: number, v: number): boolean;

    neighbors(u: number): number[] 
    {
        this._assertVertex(u);

        const neighbors = [];
        for (let v = 1; v <= this._vertexCount; v++) 
        {
            if (this.adjacent(u, v))
            {
                neighbors.push(v);
            }
        }

        return neighbors;
    }

    degree(u: number): number 
    {
        this._assertVertex(u);

        return (this._directed ? this._degreeDirected : this._degreeUndirected).apply(this, [u - 1]);
    }

    protected abstract _degreeUndirected(u: number): number;
    protected abstract _degreeDirected(u: number): number;

    protected _assertVertex(u: number): void
    {
        if (u >= 1 && u <= this._vertexCount)
        {
            return;
        }

        throw new Error(`Vertex ${u} is out of range`);
    }

    equals(other: Graph): boolean
    {
        if (other.weighted || this.directed !== other.directed) 
        {
            return false;
        }

        const otherGraph = other as UnweightedGraph;

        if (this.vertexCount !== otherGraph.vertexCount || this.edgeCount !== otherGraph.edgeCount) 
        {
            return false;
        }

        const edges = this.edges;
        const otherEdges = otherGraph.edges;

        for (let i = 0; i < edges.length; i++) 
        {
            if (edges[i].u !== otherEdges[i].u || edges[i].v !== otherEdges[i].v) 
            {
                return false;
            }
        }

        return true;
    }
}