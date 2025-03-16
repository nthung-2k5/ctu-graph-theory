import Edge from './Edge';
import WeightedGraph from './WeightedGraph';

export default class EdgeList extends WeightedGraph
{
    private _edges: Edge[];
    protected *_getEdgesUndirected() { }
    protected *_getEdgesDirected() { }
    override toMemoryGraph(): React.ReactNode {
        return '';
    }

    constructor(n: number = 0, directed: boolean = false) 
    {
        super(n, directed);
        this._edges = [];
    }

    protected _addEdgeUndirected(e: Edge)
    {
        this._addEdgeDirected(e);
    }

    protected _addEdgeDirected(e: Edge)
    {
        this._edges.push(e);
    }

    protected override _weightUndirected(u: number, v: number): number | null
    {
        return this._edges.find(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))?.weight ?? null;
    }

    protected override _weightDirected(u: number, v: number): number | null
    {
        return this._edges.find(e => e.u === u && e.v === v)?.weight ?? null;
    }
}