export default class PseudocodeAnimator
{
    private lines: string[] = [];

    private currentLine: number = 0;

    public next()
    {

    }

    public previous()
    {

    }

    public moveBy(delta: number)
    {
        for (let i = 0; i < delta; i++)
        {
            this.next();
        }
        
        for (let i = 0; i > delta; i--)
        {
            this.previous();
        }
    }

    public moveTo(lineNumber: number)
    {
        this.moveBy(lineNumber - this.currentLine);
    }
}