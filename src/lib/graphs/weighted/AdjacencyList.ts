import Edge from './Edge';
import WeightedGraph from './WeightedGraph';

export default class AdjacencyList extends WeightedGraph
{
    private _adjList: {v: number, weight: number}[][];

    protected *_getEdgesUndirected() { }
    protected *_getEdgesDirected() { }
    override toMemoryGraph(): React.ReactNode {
        return '';
    }

    constructor(n: number = 0, directed: boolean = false) 
    {
        super(n, directed);
        this._adjList = Array.from({ length: n }, () => []);
    }
    
    protected _addEdgeUndirected(e: Edge): void 
    {
        this._adjList[e.u].push({ v: e.v, weight: e.weight });
        this._adjList[e.v].push({ v: e.u, weight: e.weight });
    }

    protected _addEdgeDirected(e: Edge): void 
    {
        this._adjList[e.u].push({ v: e.v, weight: e.weight });
    }

    protected override _weightUndirected(u: number, v: number): number | null 
    {
        return this._weightDirected(u, v);
    }

    protected override _weightDirected(u: number, v: number): number | null 
    {
        const neighbor = this._adjList[u].find(neighbor => neighbor.v === v);
        return neighbor?.weight ?? null;
    }
}