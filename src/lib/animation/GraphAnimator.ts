import cytoscape from 'cytoscape';
import { wait } from '../AsyncHelper';
import { AlgorithmStep } from '../algorithms/GraphAlgorithm';
import { KEYWORD } from 'color-convert/conversions';
import type storeType from '../context/store';

let store: typeof storeType;
export const injectStore = (_store: typeof storeType) => 
{
    store = _store;
}

export default class GraphAnimator
{
    private _cy: cytoscape.Core | null = null;

    private _delay: number = 1000;

    private _stop: boolean = false;

    private _pause: boolean = false;

    public setDelay(speed: number) 
    {
        this._delay = speed;
    }

    public getDelay() 
    {
        return this._delay;
    }

    public setCytoscape(cy: cytoscape.Core): GraphAnimator
    {
        this._cy = cy;
        return this;
    }

    public resetAll(): GraphAnimator
    {
        this._stop = this._pause = false;
        const config = store.getState().config;
        
        this._cy?.elements().style({ 
            'background-color': config.nodeColor,
            'color': config.labelColor, 
            'line-color': config.edgeColor, 
            'border-color': 'black', 
            'border-width': 1, 
            'line-outline-width': 0
        }).removeAttr('marked');
        // this._cy.elements().style({ 'color': 'black', 'border-color': 'black', 'line-color': 'black', 'border-width': 1, 'line-outline-width': 0 }).removeAttr('marked');
        return this;
    }

    public colorVertex(vertex: number, color: KEYWORD): GraphAnimator
    {
        this._cy?.$id(vertex.toString()).style({ color, 'border-color': color }).attr('marked', color);
        return this;
    }
    
    public colorVertex2(vertex: number, color:string ,borderColor: string): GraphAnimator
    {
        this._cy?.$id(vertex.toString()).style({ color: '', 'border-color': borderColor, 'border-width': 2 }).attr('marked', color);
        return this;
    }

    public advancedColorVertex(vertex: number, bkColor: string, colorText: string): GraphAnimator
    {
        this._cy?.$id(vertex.toString()).style({ 'background-color': bkColor, 'border-color': bkColor, 'color': colorText });
        return this;
    }

    public colorEdge(u: number, v: number, color: KEYWORD, directed: boolean, prevColor: KEYWORD = 'black'): GraphAnimator
    {
        if (!this._cy) return this;

        const source = this._cy.$id(u.toString());
        const target = this._cy.$id(v.toString());

        const edge = (directed ? source.edgesTo(target) : source.edgesWith(target)).filter(e => prevColor === 'black' || e.data('marked') === prevColor).first();
        edge.style({ 'line-color': color, 'line-outline-color': color }).attr('marked', color);
        return this;
    }

    public stop(): GraphAnimator
    {
        this._stop = true;
        return this;
    }

    public pause(): GraphAnimator
    {
        this._pause = true;
        return this;
    }

    public async run(steps: IterableIterator<AlgorithmStep>): Promise<void>
    {
        this.resetAll();
        // setTimeout(async () => {
        // this._stop = false;
        for (const step of steps)
        {
            while (this._pause)
            {
                if (this._stop) return;
            }

            if (this._stop) return;

            step.animate?.(this);
            await wait(this._delay);
        }
        // }, 600);
    }
}