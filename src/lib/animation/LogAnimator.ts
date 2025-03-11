export default class LogAnimator 
{
    private handle: LogHandle | null = null;

    public addLog(log: string)
    {
        this.handle?.addLog(log);
    }

    public clearLogs()
    {
        this.handle?.clearLogs();
    }

    public setHandle(handle: LogHandle)
    {
        this.handle = handle;
    }
}

export interface LogHandle
{
    addLog: (log: string) => void;
    clearLogs: () => void;
}