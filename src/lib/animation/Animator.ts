import { AlgorithmStep } from '../algorithms/GraphAlgorithm';
import GraphAnimator from './GraphAnimator';
import PseudocodeAnimator from './PseudocodeAnimator';
import SubAnimator from './SubAnimator';

const PAUSE_INTERVAL = 100;
const INTERVAL_MULTIPLIER = 2;

export enum AnimationState
{
    PLAYING,
    PAUSED,
    STOPPED
}

const singleToArray = <T>(value: T | T[]): T[] =>
{
    if (Array.isArray(value) && !Array.isArray(value[0]))
    {
        return [value] as T[];
    }

    return value as T[];
}

export default class Animator extends SubAnimator
{
    private _currentTimeout: number | null = null;

    private _state: AnimationState = AnimationState.STOPPED;

    private _speed: number = 1;

    private onAnimationStateChanged: (() => void) | null = null;

    private _currentSteps: IterableIterator<AlgorithmStep> | null = null;

    public graph: GraphAnimator = new GraphAnimator();

    public pseudocode: PseudocodeAnimator = new PseudocodeAnimator();

    private get interval(): number
    {
        return 420 * INTERVAL_MULTIPLIER / this._speed;
    }

    public get state(): AnimationState
    {
        return this._state;
    }
    
    public get playing(): boolean
    {
        return this.state === AnimationState.PLAYING;
    }

    public get paused(): boolean
    {
        return this.state === AnimationState.PAUSED;
    }

    private set state(value: AnimationState)
    {
        this._state = value;
        this.onAnimationStateChanged?.();
    }

    public override reset()
    {
        this.graph.reset();
        this.pseudocode.reset();
    }

    public setOnAnimationStateChanged(callback: () => void)
    {
        this.onAnimationStateChanged = callback;
    }

    private animate(step: AlgorithmStep)
    {
        if (step.colorVertex)
        {
            const colorVertices = singleToArray(step.colorVertex);
            colorVertices.forEach(([vertex, color]) => this.graph.colorVertex(vertex, color));
        }

        if (step.colorEdge)
        {
            const colorEdges = singleToArray(step.colorEdge);
            colorEdges.forEach(([u, v, color]) => this.graph.colorEdge(u, v, color));
        }

        if (step.highlightEdge)
        {
            const highlightEdges = singleToArray(step.highlightEdge);
            highlightEdges.forEach(([u, v, highlight]) => (highlight ? this.graph.highlightEdge : this.graph.unhighlightEdge).apply(this.graph, [u, v]));
        }

        if (step.highlightVertex)
        {
            const highlightVertices = singleToArray(step.highlightVertex);
            highlightVertices.forEach(([vertex, highlight]) => (highlight ? this.graph.highlightVertex : this.graph.unhighlightVertex).apply(this.graph, [vertex]));
        }

        if (step.codeLine !== undefined)
        {
            this.pseudocode.currentLine = step.codeLine;
        }
        else
        {
            this.pseudocode.reset();
        }
    }

    public play(steps: IterableIterator<AlgorithmStep>)
    {
        if (this._currentTimeout !== null)
        {
            return;
        }

        this.reset();
        this.state = AnimationState.PLAYING;

        this._currentSteps = steps;
        let step = this._currentSteps.next();

        const runStep = () => 
        {
            if (this.state === AnimationState.PAUSED)
            {
                this._currentTimeout = window.setTimeout(runStep, PAUSE_INTERVAL);
                return;
            }
            
            if (step.done)
            {
                this.stop(false);
            }
            else
            {
                const s = step.value;
                this.animate(s);
                step = this._currentSteps!.next();

                this._currentTimeout = window.setTimeout(runStep, this.interval);
            }
        };

        runStep();
    }

    public pause()
    {
        this.state = AnimationState.PAUSED;
    }

    public resume()
    {
        this.state = AnimationState.PLAYING;
    }

    public fastForward()
    {
        if (this.state === AnimationState.STOPPED)
        {
            return;
        }

        if (this._currentTimeout !== null)
        {
            window.clearTimeout(this._currentTimeout);
            this._currentTimeout = null;
        }

        let step = this._currentSteps!.next();
        while (!step.done)
        {
            const s = step.value;
            this.animate(s);
            step = this._currentSteps!.next();
        }

        this.stop(false);
    }

    public stop(reset: boolean = true)
    {
        this.state = AnimationState.STOPPED;
        
        if (reset)
        {
            this.reset();
        }

        this._currentSteps = null;

        if (this._currentTimeout !== null)
        {
            window.clearTimeout(this._currentTimeout);
            this._currentTimeout = null;
        }
    }

    public setSpeed(speed: number)
    {
        this._speed = speed;
    }
}