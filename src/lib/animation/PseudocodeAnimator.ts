import SubAnimator from './SubAnimator';

export default class PseudocodeAnimator extends SubAnimator
{
    private handle: PseudoCodeHandle | null = null;

    public override reset()
    {
        this.handle?.reset();
    }

    public setHandle(handle: PseudoCodeHandle)
    {
        this.handle = handle;
    }

    public get currentLine(): number | null
    {
        return this.handle?.currentLine() ?? null;
    }

    public set currentLine(line: number)
    {
        this.handle?.highlightLine(line);
    }

    public next(by: number = 1)
    {
        this.currentLine = this.currentLine ?? 0 + by;
    }

    public previous(by: number = 1)
    {
        this.currentLine = this.currentLine ?? 0 - by;
    }

    public moveBy(delta: number)
    {
        if (delta > 0)
        {
            this.next(delta);
        }
        else if (delta < 0)
        {
            this.previous(-delta);
        }
    }

    public moveTo(lineNumber: number)
    {
        this.currentLine = lineNumber;
    }
}

export type PseudoCodeHandle = {
    currentLine: () => number | null;
    highlightLine: (line: number) => void;
    reset: () => void;
}