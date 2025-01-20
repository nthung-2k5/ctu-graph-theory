import Edge from './Edge';

export default abstract class WeightedGraph
{
    private _directed: boolean;

    private _vertexCount: number;

    get directed() 
    {
        return this._directed;
    }

    get vertexCount() 
    {
        return this._vertexCount;
    }

    constructor(n: number, directed: boolean) 
    {
        this._directed = directed;
        this._vertexCount = n;
    }

    addEdge(e: Edge): void 
    {
        this._assertVertex(e.u);
        this._assertVertex(e.v);

        if (this.weight(e.u, e.v) !== null || (!this._directed && this.weight(e.v, e.u) !== null))
        {
            throw new Error(`Edge (${e.u}, ${e.v}) already added`);
        }

        (this._directed ? this._addEdgeDirected : this._addEdgeUndirected).apply(this, [{ u: e.u - 1, v: e.v - 1, weight: e.weight }]);
    }

    protected abstract _addEdgeUndirected(e: Edge): void;
    protected abstract _addEdgeDirected(e: Edge): void;

    weight(u: number, v: number): number | null
    {
        this._assertVertex(u);
        this._assertVertex(v);

        return (this._directed ? this._weightDirected : this._weightUndirected).apply(this, [u - 1, v - 1]);
    }

    protected abstract _weightUndirected(u: number, v: number): number | null;
    protected abstract _weightDirected(u: number, v: number): number | null;

    neighbors(u: number): { v: number, weight: number }[]
    {
        this._assertVertex(u);

        const neighbors = [];
        for (let v = 1; v <= this._vertexCount; v++) 
        {
            const weight = this.weight(u, v);
            if (weight !== null)
            {
                neighbors.push({ v, weight });
            }
        }

        return neighbors;
    }

    protected _assertVertex(u: number): void
    {
        if (u >= 1 && u <= this._vertexCount)
        {
            return;
        }

        throw new Error(`Vertex ${u} is out of range`);
    }

    equals(other: WeightedGraph)
    {
        if (this._vertexCount !== other._vertexCount || this._directed !== other._directed) 
        {
            return false;
        }

        const edges = this.edges;
        const otherEdges = other.edges;

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