import { AlgorithmStep } from '../algorithms/GraphAlgorithm';
import DebuggerAnimator from './DebuggerAnimator';
import GraphAnimator from './GraphAnimator';
import PseudocodeAnimator from './PseudocodeAnimator';
import SubAnimator from './SubAnimator';

const PAUSE_INTERVAL = 100;
const INTERVAL_MULTIPLIER = 4;

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

    private onAnimationStep: ((progress: number) => void) | null = null;

    private _animationLength: number = 0;

    private _currentSteps: IterableIterator<AlgorithmStep> | null = null;

    private _stepHistory: AlgorithmStep[] = [];

    private _step: number = 0;

    public graph: GraphAnimator = new GraphAnimator();

    public pseudocode: PseudocodeAnimator = new PseudocodeAnimator();

    public debugger: DebuggerAnimator = new DebuggerAnimator();

    public get interval(): number
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
        this.onAnimationStep?.(0);
        this.graph.reset();
        this.pseudocode.reset();
        this.debugger.reset();
    }

    public setOnAnimationStateChanged(callback: () => void)
    {
        this.onAnimationStateChanged = callback;
    }

    public setOnAnimationStep(callback: (progress: number) => void)
    {
        this.onAnimationStep = callback;
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
        
        // if (step.description !== undefined)
        // {
        //     this.pseudocode.description = step.description;
        // }

        if (step.addVariable)
        {
            const variables = singleToArray(step.addVariable);
            variables.forEach(([name, value, scope]) => this.debugger.addVariable(name, value, scope));
        }

        if (step.removeVariable)
        {
            const variables = singleToArray(step.removeVariable);
            variables.forEach(([name, scope]) => this.debugger.removeVariable(name, scope));
        }

        if (step.updateVariable)
        {
            const variables = singleToArray(step.updateVariable);
            variables.forEach(([name, value, scope]) => this.debugger.updateVariable(name, value, scope));
        }

        if (step.pushStackTrace)
        {
            this.debugger.pushStackFrame(step.pushStackTrace);
        }

        if (step.popStackTrace)
        {
            this.debugger.popStackFrame();
        }
    }

    public play(steps: () => IterableIterator<AlgorithmStep>)
    {
        if (this._currentTimeout !== null)
        {
            return;
        }

        this.reset();
        this.state = AnimationState.PLAYING;

        this._currentSteps = steps();
        this._stepHistory = [];
        this._animationLength = Array.from(steps()).length;
        this._step = 0;

        const runStep = () => 
        {
            if (this.state === AnimationState.PAUSED)
            {
                this._currentTimeout = window.setTimeout(runStep, PAUSE_INTERVAL);
                return;
            }

            const step = this._currentSteps!.next();
            if (step.done)
            {
                this.stop(false);
            }
            else
            {
                this.animate(step.value);
                this._step++;
                this._stepHistory.push(step.value);
                this.onAnimationStep?.(this._step / this._animationLength);

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

    public rewind()
    {
        this.reset();
        for (let i = 0; i < this._step - 1; i++)
        {
            this.animate(this._stepHistory[i]);
        }

        this._step--;
        this.onAnimationStep?.(this._step / this._animationLength);
    }

    public forward()
    {
        const step = this._currentSteps!.next();
        if (step?.done)
        {
            return;
        }

        this.animate(step.value);
        this._step++;
        this._stepHistory.push(step.value);
        this.onAnimationStep?.(this._step / this._animationLength);
    }

    public fastForward()
    {
        // if (this.state === AnimationState.STOPPED)
        // {
        //     return;
        // }

        // if (this._currentTimeout !== null)
        // {
        //     window.clearTimeout(this._currentTimeout);
        //     this._currentTimeout = null;
        // }

        // while (this._step < this._currentSteps.length)
        // {
        //     this.animate(this._currentSteps[this._step]);
        //     this._step++;
        // }

        // this.onAnimationStep?.(1);
        // this.stop(false);
    }

    public stop(reset: boolean = true)
    {
        this.state = AnimationState.STOPPED;
        
        if (reset)
        {
            this.reset();
        }

        this._currentSteps = null;
        this._stepHistory = [];
        this._animationLength = 0;
        this._step = 0;

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