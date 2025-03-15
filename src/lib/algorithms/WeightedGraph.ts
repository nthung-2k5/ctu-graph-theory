import Edge from '../graphs/weighted/Edge';

export interface Neighbor
{
    v: number;
    weight: number;
}

export class WeightedGraph
{
    private _edges: Edge[] = [];

    private _list: Neighbor[][];

    private _directed: boolean;
    
    private _vertexCount: number;
    
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
        return this._edges.length;
    }
        
    get edges()
    {
        return this._edges;
    }

    get list()
    {
        return this._list;
    }
    
    constructor(n: number, directed: boolean = false) 
    {
        this._directed = directed;
        this._vertexCount = n;
        this._list = Array.from({ length: n + 1 }, () => []);
    }
    
    addEdge(e: Edge): void 
    {
        this._assertVertex(e.u);
        this._assertVertex(e.v);
        
        if (e.u === e.v) return;
        
        this._edges.push(e);
        this._list[e.u].push({ v: e.v, weight: e.weight });
        if (!this._directed)
        {
            this._list[e.v].push({ v: e.u, weight: e.weight });
        }
    }
    
    adjacent(u: number, v: number): boolean 
    {
        this._assertVertex(u);
        this._assertVertex(v);
        
        return this._list[u].some(neighbor => neighbor.v === v);
    }
    
    neighbors(u: number): Neighbor[] 
    {
        this._assertVertex(u);
        return this._list[u];
    }
    
    protected _assertVertex(u: number): void
    {
        if (u >= 1 && u <= this._vertexCount)
        {
            return;
        }
    
        throw new Error(`Vertex ${u} is out of range`);
    }
}