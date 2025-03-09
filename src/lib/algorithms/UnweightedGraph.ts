import Edge from '../graphs/unweighted/Edge';

export class UnweightedGraph
{
    private _edges: Edge[] = [];

    private _matrix: number[][];

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

    get matrix()
    {
        return this._matrix;
    }
    
    constructor(n: number, directed: boolean = false) 
    {
        this._directed = directed;
        this._vertexCount = n;
        this._matrix = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    }
    
    addEdge(e: Edge): void 
    {
        this._assertVertex(e.u);
        this._assertVertex(e.v);

        if (e.u === e.v) return;
        
        this._edges.push(e);
        this._matrix[e.u][e.v] = 1;
        if (!this._directed)
        {
            this._matrix[e.v][e.u] = 1;
        }
    }
    
    adjacent(u: number, v: number): boolean 
    {
        this._assertVertex(u);
        this._assertVertex(v);
        
        return this._matrix[u][v] > 0;
    }
    
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
    
    protected _assertVertex(u: number): void
    {
        if (u >= 1 && u <= this._vertexCount)
        {
            return;
        }
    
        throw new Error(`Vertex ${u} is out of range`);
    }
}