import cytoscape from 'cytoscape';
import { KEYWORD } from 'color-convert/conversions';
import SubAnimator from './SubAnimator';
import store from '../context/store';

export default class GraphAnimator extends SubAnimator
{
    private _cy: cytoscape.Core | null = null;

    public setCytoscape(cy: cytoscape.Core): GraphAnimator
    {
        this._cy = cy;
        return this;
    }

    public override reset(): GraphAnimator
    {
        const config = store.getState().config;
        
        this._cy?.elements().style({ 
            'background-color': config.nodeColor,
            'color': config.labelColor, 
            'line-color': config.edgeColor, 
            'border-color': 'black', 
            'border-width': 2,
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
}