export default abstract class animator
{
    protected speed: number = 1;

    protected get interval(): number
    {
        return 420 * 4 / this.speed;
    }

    public abstract run(): void;
    public abstract pause(): void;
    public abstract stop(): void;

    public setSpeed(speed: number)
    {
        this.speed = speed;
    }
}