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

    public set currentLine(line: number | [number, number])
    {
        this.handle?.highlightLine(line);
    }
}

export type PseudoCodeHandle = {
    highlightLine: (line: number | [number, number]) => void;
    reset: () => void;
}