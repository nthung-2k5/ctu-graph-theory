import Edge from './Edge';
import WeightedGraph from './WeightedGraph';

export default class IncidenceMatrix extends WeightedGraph
{
    private _matrix: (number | null)[][];

    protected *_getEdgesUndirected() { }
    protected *_getEdgesDirected() { }
    override toMemoryGraph(): React.ReactNode {
        return '';
    }

    protected override _edgeCount: number = 0;

    constructor(n: number = 0, directed: boolean = false) 
    {
        super(n, directed);
        this._matrix = Array.from({ length: n }, () => []);
    }

    protected _addEdgeUndirected(e: Edge): void 
    {
        for (let u = 0; u < this.vertexCount; u++)
        {
            this._matrix[u].push(null);
        }

        this._matrix[e.u][this._edgeCount] = e.weight;
        this._matrix[e.v][this._edgeCount] = e.weight;
        this._edgeCount++;
    }

    protected _addEdgeDirected(e: Edge): void 
    {
        for (let u = 0; u < this.vertexCount; u++)
        {
            this._matrix[u].push(0);
        }

        if (e.u === e.v)
        {
            this._matrix[e.u][this._edgeCount] = e.weight;
        }
        else
        {
            this._matrix[e.u][this._edgeCount] = e.weight;
            this._matrix[e.v][this._edgeCount] = -e.weight;
        }
    }

    protected override _weightUndirected(_u: number, _v: number): number | null
    {
        throw new Error('Method not implemented.');
    }

    protected override _weightDirected(_u: number, _v: number): number | null
    {
        throw new Error('Method not implemented.');
    }
}