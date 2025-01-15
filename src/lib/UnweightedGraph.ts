export default class UnweightedGraph
{
    private _matrix: number[][];
    private _directed: boolean;

    public get matrix(): number[][] {
        return this._matrix;
    }

    public get directed(): boolean {
        return this._directed;
    }

    public get vertexCount(): number {
        return this._matrix.length;
    }

    public oneIndex: boolean = false;

    constructor(n: number = 0, directed: boolean = false)
    {
        this._matrix = [];
        for (let i = 0; i < n; i++) {
            this._matrix.push(new Array(n).fill(0));
        }
        
        this._directed = directed;
    }

    public adjacent(u: number, v: number): boolean {
        if (!this._validVertex(u) || !this._validVertex(v)) {
            throw new Error('Vertex out of range');
        }

        return this._matrix[this._vertexIndex(u)][this._vertexIndex(v)] !== 0;
    }

    public neighbors(u: number): number[] {
        if (!this._validVertex(u)) {
            throw new Error('Vertex out of range');
        }

        const neighbors: number[] = [];
        for (let v = 0; v < this.vertexCount; v++) {
            for (let k = 0; k < this._matrix[u][v]; k++) {
                neighbors.push(v);
            }
        }

        return neighbors;
    }

    public degree(u: number): number {
        if (!this._validVertex(u)) {
            throw new Error('Vertex out of range');
        }

        if (!this._directed)
        {
            return this._matrix[this._vertexIndex(u)].reduce((acc, value) => acc + value, 0);
        }
        else
        {
            let inDegree = 0;
            let outDegree = 0;

            for (let i = 0; i < this._matrix.length; i++)
            {
                inDegree += this._matrix[i][this._vertexIndex(u)];
                outDegree += this._matrix[this._vertexIndex(u)][i];
            }

            return inDegree + outDegree;
        }
    }

    private _vertexIndex(u: number): number {
        return this.oneIndex ? u - 1 : u;
    }

    private _validVertex(u: number): boolean {
        if (this.oneIndex) {
            u -= 1;
        }

        return u >= 0 && u < this.vertexCount; 
    }

    public addEdge(u: number, v: number)
    {
        if (!this._validVertex(u) || !this._validVertex(v))
        {
            return;
        }

        this._matrix[this._vertexIndex(u)][this._vertexIndex(v)] += 1;

        if (!this._directed)
        {
            this._matrix[this._vertexIndex(v)][this._vertexIndex(u)] += 1;
        }
    }

    public equals(other: UnweightedGraph): boolean
    {
        if (this.vertexCount !== other.vertexCount || this._directed !== other._directed)
        {
            return false;
        }

        for (let i = 0; i < this.vertexCount; i++)
        {
            if (!this.matrix[i].every((value, index) => value === other.matrix[i][index]))
            {
                return false;
            }
        }

        return true;
    }
}