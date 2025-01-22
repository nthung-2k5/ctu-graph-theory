import cytoscape from 'cytoscape';
import { wait } from './AsyncHelper';
import { AlgorithmStep } from './algorithms/GraphAlgorithm';

export default class GraphAnimator
{
    private _cytoscape: cytoscape.Core;

    private _delay: number = 500;

    private _stop: boolean = false;

    public constructor(cy: cytoscape.Core)
    {
        this._cytoscape = cy;
    }

    public resetAll(): void
    {
        this._stop = false;
        this._cytoscape.elements().style({ 'color': 'black', 'border-color': 'black', 'border-width': 1 });
    }

    public colorVertex(vertex: number, color: string): void
    {
        this._cytoscape.$id(vertex.toString()).style({ color, 'border-color': color, 'border-width': 2 });
    }

    public colorEdge(edge: number, color: string): void
    {
        this._cytoscape.$id(edge.toString()).animate({ style: { color, 'border-color': color } }, { duration: 200 });
    }

    public stop(): void
    {
        this._stop = true;
    }

    public async run(steps: IterableIterator<AlgorithmStep>): Promise<void>
    {
        this.resetAll();
        for (const step of steps)
        {
            console.log(this);
            if (this._stop)
            {
                return;
            }
            step.animate(this);
            await wait(this._delay);
        }
    }
}