import Edge from '../graphs/weighted/Edge';

export interface Neighbor
{
    v: number;
    weight: number;
}

export class WeightedGraph
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
        this._matrix = Array.from({ length: n + 1 }, () => Array.from({ length: n + 1 }, () => Infinity));
    }
    
    addEdge(e: Edge): void 
    {
        this._assertVertex(e.u);
        this._assertVertex(e.v);
        
        if (e.u === e.v) return;
        
        this._edges.push(e);
        this._matrix[e.u][e.v] = Math.min(this._matrix[e.u][e.v], e.weight);
        if (!this._directed)
        {
            this._matrix[e.v][e.u] = Math.min(this._matrix[e.v][e.u], e.weight);
        }
    }
    
    adjacent(u: number, v: number): boolean 
    {
        this._assertVertex(u);
        this._assertVertex(v);
        
        return this._matrix[u][v] !== Infinity;
    }

    weight(u: number, v: number): number
    {
        this._assertVertex(u);
        this._assertVertex(v);
        
        return this._matrix[u][v];
    }
    
    neighbors(u: number): Neighbor[] 
    {
        this._assertVertex(u);
        return this._matrix[u].map((weight, v) => ({ v, weight })).filter(neighbor => neighbor.weight !== Infinity);
    }

    inDegree(u: number): number 
    {
        this._assertVertex(u);
        
        let count = 0;
        for (let v = 1; v <= this._vertexCount; v++) 
        {
            if (this._matrix[v][u] > 0) 
            {
                count++;
            }
        }
        return count;
    }

    outDegree(u: number): number 
    {
        this._assertVertex(u);
        
        let count = 0;
        for (let v = 1; v <= this._vertexCount; v++) 
        {
            if (this._matrix[u][v] > 0) 
            {
                count++;
            }
        }

        return count;
    }

    degree(u: number): number 
    {
        this._assertVertex(u);
        return this.directed ? this.inDegree(u) + this.outDegree(u) : this.outDegree(u);
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