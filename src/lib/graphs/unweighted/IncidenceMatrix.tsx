import { ReactNode } from 'react';
import Edge from './Edge';
import UnweightedGraph from './UnweightedGraph';

export default class IncidenceMatrix extends UnweightedGraph
{
    private _matrix: number[][];

    constructor(n: number = 0, directed: boolean = false) 
    {
        super(n, directed);
        this._matrix = Array.from({ length: n }, () => []);
    }

    protected _addEdgeUndirected(e: Edge): void 
    {
        for (let u = 0; u < this.vertexCount; u++)
        {
            this._matrix[u].push(0);
        }

        this._matrix[e.u][this.edgeCount]++;
        this._matrix[e.v][this.edgeCount]++;
    }

    protected _addEdgeDirected(e: Edge): void 
    {
        for (let u = 0; u < this.vertexCount; u++)
        {
            this._matrix[u].push(0);
        }

        if (e.u === e.v)
        {
            this._matrix[e.u][this.edgeCount] = 2;
        }
        else
        {
            this._matrix[e.u][this.edgeCount] = 1;
            this._matrix[e.v][this.edgeCount] = -1;
        }
    }

    protected _adjacentUndirected(u: number, v: number): boolean 
    {
        return this._adjacentDirected(u, v);
    }

    protected _adjacentDirected(u: number, v: number): boolean 
    {
        if (u === v && this._matrix[u].includes(2))
        {
            return true;
        }
        
        for (let e = 0; e < this.edgeCount; e++)
        {
            if (u === v) continue;
            
            if (this._matrix[u][e] === 1 && this._matrix[v][e] !== 0)
            {
                return true;
            }
        }

        return false;
    }
    
    toMemoryGraph(): ReactNode
    {
        return (
            <div className={`grid mb-auto`} style={{ gridTemplateColumns: `repeat(${this.edgeCount + 1}, 1fr)` }}>
                <span className='w-8 h-8 inline-flex items-center justify-center'>A</span>
                {Array.from({ length: this.edgeCount }, (_, i) => (
                    <div key={-(i + 1)} className='w-8 h-8 border border-border inline-flex items-center justify-center'>{i + 1}</div>
                ))}
                {this._matrix.map((row, rowIndex) => [
                    <div key={this.vertexCount * rowIndex} className='w-8 h-8 border border-border inline-flex items-center justify-center'>{rowIndex + 1}</div>,
                    ...row.map((cell, cellIndex) => (
                        <div key={this.vertexCount * rowIndex + cellIndex + 1} className='w-8 h-8 border border-border inline-flex items-center justify-center'>
                            {cell}
                        </div>
                    ))
                ])}
            </div>
        );
    }

    protected _degreeUndirected(u: number): number 
    {
        return this._degreeDirected(u);
    }

    protected _degreeDirected(u: number): number 
    {
        let degree = 0;
        for (let i = 0; i < this._matrix[u].length; i++)
        {
            degree += Math.abs(this._matrix[u][i]);
        }

        return degree;
    }

    protected *_getEdgesUndirected(): IterableIterator<Edge> 
    {
        const transposed = transpose(this._matrix);
        for (const edge of transposed)
        {
            if (edge.includes(2))
            {
                const idx = edge.indexOf(2);
                yield { u: idx, v: idx };
            }
            else
            {
                yield { u: edge.indexOf(1), v: edge.lastIndexOf(1) };
            }
        }

        function transpose(matrix: number[][]) 
        {
            return matrix[0].map((_, i) => matrix.map(row => row[i]));
        }
    }

    protected *_getEdgesDirected(): IterableIterator<Edge> 
    {
        const transposed = transpose(this._matrix);
        for (const edge of transposed)
        {
            if (edge.includes(2))
            {
                const idx = edge.indexOf(2);
                yield { u: idx, v: idx };
            }
            else
            {
                yield { u: edge.indexOf(1), v: edge.indexOf(-1) };
            }
        }

        function transpose(matrix: number[][]) 
        {
            return matrix[0].map((_, i) => matrix.map(row => row[i]));
        }
    }
}