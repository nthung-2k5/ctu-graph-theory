import cytoscape from 'cytoscape';
import { wait } from './AsyncHelper';
import { AlgorithmStep } from './algorithms/GraphAlgorithm';
import { KEYWORD } from 'color-convert/conversions';

export default class GraphAnimator
{
    private _cy: cytoscape.Core;

    private _delay: number = 1000;

    private _stop: boolean = false;

    private _colorNodeInput: HTMLInputElement | null = document.querySelector('input[name="color-node"]');

    private _colorEdgeInput: HTMLInputElement | null = document.querySelector('input[name="color-edge"]'); 

    private _colorTextNumberSelect: HTMLSelectElement | null = document.querySelector('select[name="color-text-node"]');

    public setDelay(speed: number) {
        this._delay = speed;
    }

    public getDelay() {
        return this._delay;
    }

    public constructor(cy: cytoscape.Core)
    {
        this._cy = cy;
    }

    public setCytoscape(cy: cytoscape.Core): GraphAnimator
    {
        this._cy = cy;
        return this;
    }

    public resetAll(): GraphAnimator
    {
        this._stop = false;
        this._cy.elements().style({ 
            'background-color': this._colorNodeInput?.value,
            'color': this._colorTextNumberSelect?.value, 
            'line-color': this._colorEdgeInput?.value, 
            'border-color': 'black', 
            'border-width': 1, 
            'line-outline-width': 0 
        }).removeAttr('marked');
        // this._cy.elements().style({ 'color': 'black', 'border-color': 'black', 'line-color': 'black', 'border-width': 1, 'line-outline-width': 0 }).removeAttr('marked');
        return this;
    }

    public colorVertex(vertex: number, color: KEYWORD): GraphAnimator
    {
        this._cy.$id(vertex.toString()).style({ color, 'border-color': color }).attr('marked', color);
        return this;
    }
    
    public colorVertex2(vertex: number, color:string ,borderColor: string): GraphAnimator
    {
        this._cy.$id(vertex.toString()).style({ color: '', 'border-color': borderColor, 'border-width': 2 }).attr('marked', color);
        return this;
    }

    public advancedColorVertex(vertex: number, bkColor: string, colorText: string): GraphAnimator
    {
        this._cy.$id(vertex.toString()).style({ 'background-color': bkColor, 'border-color': bkColor, 'color': colorText });
        return this;
    }

    // public zoomAnimation(vertex: number, zoom: number) {
    //     return this;
    // }

    public colorEdge(u: number, v: number, color: KEYWORD, directed: boolean, prevColor: KEYWORD = 'black'): GraphAnimator
    {
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

    public async run(steps: IterableIterator<AlgorithmStep>): Promise<void>
    {
        this.resetAll();
        // setTimeout(async () => {
        // this._stop = false;
        for (const step of steps)
        {
            if (this._stop) return;

            step.animate(this);
            await wait(this._delay);
        }
        // }, 600);
    }
}