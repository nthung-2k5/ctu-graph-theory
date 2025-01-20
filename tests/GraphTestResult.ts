export default class GraphTestResult<Result>
{
    private _expect: { undirected: Record<number, Result>, directed: Record<number, Result> };

    constructor(expect: { undirected: Record<number, Result>, directed: Record<number, Result> })
    {
        this._expect = expect;
    }

    public get(u: number, directed: boolean)
    {
        return this._expect[directed ? 'directed' : 'undirected'][u];
    }
}