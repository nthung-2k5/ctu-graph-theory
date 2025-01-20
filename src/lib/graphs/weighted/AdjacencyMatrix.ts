import Edge from './Edge';
import WeightedGraph from './WeightedGraph';

export default class AdjacencyMatrix extends WeightedGraph
{
    private _matrix: (number | null)[][];

    constructor(n: number, directed: boolean = false) 
    {
        super(n, directed);
        this._matrix = Array.from({ length: n }, () => new Array(n).fill(null));
    }
    
    protected _addEdgeUndirected(e: Edge): void 
    {
        this._matrix[e.u][e.v] = e.weight;
        this._matrix[e.v][e.u] = e.weight;
    }

    protected _addEdgeDirected(e: Edge): void 
    {
        this._matrix[e.u][e.v] = e.weight;
    }

    protected override _weightUndirected(u: number, v: number): number | null
    {
        return this._weightDirected(u, v);
    }

    protected override _weightDirected(u: number, v: number): number | null
    {
        return this._matrix[u][v];
    }
}