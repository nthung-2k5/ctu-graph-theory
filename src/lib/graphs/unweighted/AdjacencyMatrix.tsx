import { ReactNode } from 'react';
import Edge from './Edge';
import UnweightedGraph from './UnweightedGraph';

export default class AdjacencyMatrix extends UnweightedGraph
{
    private _matrix: number[][];

    constructor(n: number, directed: boolean = false) 
    {
        super(n, directed);
        this._matrix = Array.from({ length: n }, () => new Array(n).fill(0));
    }
    
    protected _addEdgeUndirected(e: Edge): void 
    {
        this._matrix[e.u][e.v]++;
        this._matrix[e.v][e.u]++;
    }

    protected _addEdgeDirected(e: Edge): void 
    {
        this._matrix[e.u][e.v]++;
    }

    protected _adjacentUndirected(u: number, v: number): boolean 
    {
        return this._adjacentDirected(u, v);
    }

    toMemoryGraph(): ReactNode
    {
        return (
            <div className={`grid mb-auto`} style={{ gridTemplateColumns: `repeat(${this.vertexCount + 1}, 1fr)` }}>
                <span className='w-8 h-8 inline-flex items-center justify-center'>A</span>
                {Array.from({ length: this.vertexCount }, (_, i) => (
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

    protected _adjacentDirected(u: number, v: number): boolean 
    {
        return this._matrix[u][v] !== 0;
    }
    
    protected _degreeUndirected(u: number): number 
    {
        return this._matrix[u].reduce((acc, value) => acc + value, 0);
    }

    protected _degreeDirected(u: number): number 
    {
        let inDegree = 0;
        let outDegree = 0;

        for (let i = 0; i < this._matrix.length; i++) 
        {
            inDegree += this._matrix[i][u];
            outDegree += this._matrix[u][i];
        }

        return inDegree + outDegree;
    }

    protected *_getEdgesUndirected(): IterableIterator<Edge> 
    {
        for (let u = 0; u < this.vertexCount; u++) 
        {
            for (let v = u; v < this.vertexCount; v++) 
            {
                for (let k = 0; k < this._matrix[u][v]; k++) 
                {
                    yield { u, v };
                }
            }
        }
    }
    
    protected *_getEdgesDirected(): IterableIterator<Edge> 
    {
        for (let u = 0; u < this.vertexCount; u++) 
        {
            for (let v = 0; v < this.vertexCount; v++) 
            {
                for (let k = 0; k < this._matrix[u][v]; k++) 
                {
                    yield { u, v };
                }
            }
        }
    }
}