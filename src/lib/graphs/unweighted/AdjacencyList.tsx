import { ReactNode } from 'react';
import Edge from './Edge';
import UnweightedGraph from './UnweightedGraph';

export default class AdjacencyList extends UnweightedGraph
{
    private _adjList: number[][];

    constructor(n: number = 0, directed: boolean = false) 
    {
        super(n, directed);
        this._adjList = Array.from({ length: n }, () => []);
    }
    
    protected _addEdgeUndirected(e: Edge): void 
    {
        this._adjList[e.u].push(e.v);

        if (e.u !== e.v)
        {
            this._adjList[e.v].push(e.u);
        }
    }

    protected _addEdgeDirected(e: Edge): void 
    {
        this._adjList[e.u].push(e.v);
    }

    protected _adjacentUndirected(u: number, v: number): boolean 
    {
        return this._adjacentDirected(u, v);
    }

    protected _adjacentDirected(u: number, v: number): boolean 
    {
        return this._adjList[u].includes(v);
    }

    protected _degreeUndirected(u: number): number 
    {
        return this._adjList[u].length;
    }

    protected _degreeDirected(u: number): number 
    {
        return this._adjList[u].length + this._adjList.reduce((acc, row) => acc + row.filter(v => v === u).length, 0);
    }

    toMemoryGraph(): ReactNode
    {
        const maxEdges = this._adjList.reduce((acc, row) => Math.max(acc, row.length), 0);
        return (
            <div className='grid grid-cols-[auto,1fr] mb-auto'>
                <div/>
                <strong className='mb-2'>adj</strong>
                {this._adjList.map((row, rowIndex) => [
                    <span key={-rowIndex} className='h-full inline-flex items-center justify-end mr-2'>{rowIndex + 1}</span>,
                    <div key={rowIndex} className='flex text-center p-2 border border-border'>
                        {Array.from({length: maxEdges}).map((_, i) => (
                            <span key={i} className='w-8 h-8 border border-border inline-flex items-center justify-center'>
                                {i < row.length ? row[i] + 1 : ''}
                            </span>
                        ))}
                    </div>
                ])}
            </div>
        );
    }

    protected *_getEdgesUndirected(): IterableIterator<Edge> 
    {
        for (let u = 0; u < this._adjList.length; u++)
        {
            for (const v of this._adjList[u])
            {
                if (u < v)
                {
                    yield { u, v };
                }
            }
        }
    }

    protected _getEdgesDirected(): IterableIterator<Edge> 
    {
        return this._adjList.map((neighbors, u) => neighbors.map(v => ({ u, v }))).flat().values();
    }
}