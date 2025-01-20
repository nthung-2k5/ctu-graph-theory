import cytoscape from 'cytoscape';

export default class GraphAnimator
{
    private _cytoscape: cytoscape.Core;

    public constructor(cy: cytoscape.Core)
    {
        this._cytoscape = cy;
    }

    public fadeOutAll(): void
    {
        this._cytoscape.elements().animate({ style: { 'opacity': 0 } }, { duration: 500 });
    }

    public fadeInAll(): void
    {
        this._cytoscape.elements().animate({ style: { 'opacity': 1 } }, { duration: 500 });
    }
    
    public fadeInEdge(): void
    {
        this._cytoscape.edges().animate({ style: { 'opacity': 0 } }, { duration: 500 });
    }
}