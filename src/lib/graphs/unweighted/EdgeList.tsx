import { ReactNode } from 'react';
import Edge from './Edge';
import UnweightedGraph from './UnweightedGraph';
import LabeledNumber from '../../../components/LabeledNumber';

export default class EdgeList extends UnweightedGraph
{
    private _edges: Edge[];

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

    protected _adjacentUndirected(u: number, v: number)
    {
        return this._edges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u));
    }
    
    override toMemoryGraph(): ReactNode
    {
        return (
            <div className='grid grid-cols-[auto,1fr]'>
                <div/>
                <strong className='mb-2'>edges</strong>
                {this._edges.map(({ u, v }, rowIndex) => [
                    <span key={"index of " + rowIndex} className='h-full inline-flex items-center justify-end mr-2'>{rowIndex + 1}</span>,
                    
                    <div key={rowIndex} className='flex flex-col text-center border border-b-0 border-border'>
                        <div className='flex py-2 p-3'>
                            <LabeledNumber label='u' value={u + 1} />
                            <LabeledNumber label='v' value={v + 1} />
                        </div>
                        {rowIndex == this._edges.length - 1 && <hr className='border-border' />}
                    </div>
                ])}
            </div>
        );
    }

    protected _adjacentDirected(u: number, v: number): boolean 
    {
        return this._edges.some(e => e.u === u && e.v === v);
    }

    protected _degreeUndirected(u: number): number 
    {
        return this._edges.filter(e => e.u === u).length + this._edges.filter(e => e.v === u).length;
    }

    protected _degreeDirected(u: number): number 
    {
        return this._edges.filter(e => e.u === u).length + this._edges.filter(e => e.v === u).length;
    }

    protected _getEdgesUndirected(): IterableIterator<Edge> 
    {
        return this._edges.values();
    }

    protected _getEdgesDirected(): IterableIterator<Edge> 
    {
        return this._edges.values();
    }
}