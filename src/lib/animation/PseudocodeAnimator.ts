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

    public set description(value: string | [string | undefined, string])
    {
        this.handle?.description(value);
    }

    public next(by: number = 1)
    {
        this.currentLine = this.currentLine ?? 0 + by;
    }

    public previous(by: number = 1)
    {
        this.currentLine = this.currentLine ?? 0 - by;
    }
}

export type PseudoCodeHandle = {
    description: (line: string | [string | undefined, string]) => void;
    currentLine: () => number | null;
    highlightLine: (line: number) => void;
    reset: () => void;
}