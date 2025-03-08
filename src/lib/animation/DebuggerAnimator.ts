import { ArrayType, DebuggerHandle, Primitive, SequenceType, Variable } from '../../tabs/Debugger';
import SubAnimator from './SubAnimator';

export default class DebuggerAnimator extends SubAnimator
{
    private handle: DebuggerHandle | null = null;

    public override reset()
    {
        this.handle?.clearStackTrace();
    }

    public setHandle(handle: DebuggerHandle)
    {
        this.handle = handle;
    }
    
    public addVariable(variable: string, value: Primitive | { type: SequenceType, value: ArrayType }, scope: 'local' | 'global')
    {
        if (typeof value !== 'object')
        {
            this.handle?.addPrimitive(variable, value, scope);
        }
        else
        {
            this.handle?.addArray(variable, value.value, value.type, scope);
        }
    }

    public removeVariable(variable: string, scope: 'local' | 'global')
    {
        this.handle?.removeVariable(variable, scope);
    }

    public updateVariable(variable: string, value: Variable, scope: 'local' | 'global')
    {
        this.handle?.updateVariable(variable, value, scope);
    }

    public pushStackFrame(name: string)
    {
        this.handle?.pushStackFrame(name);
    }

    public popStackFrame()
    {
        this.handle?.popStackFrame();
    }
}