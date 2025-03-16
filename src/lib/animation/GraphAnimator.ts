import cytoscape, { Css } from 'cytoscape';
import { KEYWORD } from 'color-convert/conversions';
import SubAnimator from './SubAnimator';
import store from '../context/store';

export default class GraphAnimator extends SubAnimator
{
    private _cy: cytoscape.Core | null = null;

    private _resetHandler: (() => void) | null = null;

    public setResetHandler(handler: () => void): GraphAnimator
    {
        this._resetHandler = handler;
        return this;
    }

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
            'line-outline-width': 0,
            'line-outline-color': config.edgeColor,
            'target-arrow-color': 'black',
        });

        this._resetHandler?.();
        return this;
    }

    public resetLabels(): GraphAnimator
    {
        this._cy?.edges().forEach(edge => { edge.scratch('label', ''); });
        return this;
    }

    public colorVertex(vertex: number, color: KEYWORD | 'default'): GraphAnimator
    {
        const config = store.getState().config;
        const nodeColor = config.nodeColor;

        this._setVertexStyle(vertex, { 'background-color': color === 'default' ? nodeColor : color });
        return this;
    }

    public borderColorVertex(vertex: number, color: KEYWORD | 'default'): GraphAnimator
    {
        this._setVertexStyle(vertex, { 'border-color': color === 'default' ? 'black' : color });
        return this;
    }

    public contentColorVertex(vertex: number, color: KEYWORD | 'default'): GraphAnimator
    {
        const config = store.getState().config;
        const labelColor = config.labelColor;

        this._setVertexStyle(vertex, { color: color === 'default' ? labelColor : color });
        return this;
    }

    private _setVertexStyle(vertex: number, style: Css.Node): GraphAnimator
    {
        this._cy?.$id(vertex.toString()).style(style);
        return this;
    }

    private _setEdgeStyle(u: number, v: number, style: Css.Edge): GraphAnimator
    {
        if (!this._cy) return this;

        const source = this._cy.$id(u.toString());
        const target = this._cy.$id(v.toString());

        const directed = store.getState().graph.directed;

        const edge = (directed ? source.edgesTo(target) : source.edgesWith(target)).first();
        edge.style(style);
        return this;
    }

    public highlightVertex(vertex: number): GraphAnimator
    {
        return this._setVertexStyle(vertex, { 'border-width': 3 });
    }

    public unhighlightVertex(vertex: number): GraphAnimator
    {
        return this._setVertexStyle(vertex, { 'border-width': 2 });
    }

    public highlightEdge(u: number, v: number): GraphAnimator
    {
        return this._setEdgeStyle(u, v, { 'line-outline-width': 1 });
    }

    public unhighlightEdge(u: number, v: number): GraphAnimator
    {
        return this._setEdgeStyle(u, v, { 'line-outline-width': 0 });
    }
    
    public colorEdge(u: number, v: number, color: KEYWORD | 'default'): GraphAnimator
    {
        const config = store.getState().config;
        const edgeColor = config.edgeColor;
        const realColor = color === 'default' ? edgeColor : color;

        return this._setEdgeStyle(u, v, { 'line-color': realColor, 'target-arrow-color': realColor, 'line-outline-color': realColor });
    }

    public backgroundColorVertex(vertex: number, color: KEYWORD | 'default'): GraphAnimator
    {
        const config = store.getState().config;
        const edgeColor = config.nodeColor;
        
        return this._setVertexStyle(vertex, { 'background-color': color === 'default' ? edgeColor : color });
    }

    public labelEdge(u: number, v: number, label: string): GraphAnimator
    {
        if (!this._cy) return this;

        const source = this._cy.$id(u.toString());
        const target = this._cy.$id(v.toString());

        const directed = store.getState().graph.directed;

        const edge = (directed ? source.edgesTo(target) : source.edgesWith(target)).first();
        edge.scratch('label', label);
        return this;
    }

    public customAction(action: (cy: cytoscape.Core) => void): GraphAnimator
    {
        action(this._cy!);
        return this;
    }
}