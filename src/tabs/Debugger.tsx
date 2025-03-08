import { useMemo, useRef, useState } from 'react';
import { uuidv7 } from 'uuidv7';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';

export type Primitive = string | number | boolean;
export type ArrayType = Primitive[] | Primitive[][];

export enum SequenceType
{
    Array,
    Stack,
    Queue,
}

export type Variable = Primitive | ArrayType;

// Define the structure of a variable
type DebuggerVariable = {
    id: string;
    name: string;
    value: Variable;
    type?: SequenceType;
    scope: 'local' | 'global'; // Added scope to distinguish between local and global
};

// Define stack trace entry structure
type StackTraceEntry = {
    id: string;
    functionName: string;
};

// Define the imperative handle interface
export interface DebuggerHandle 
{
    addPrimitive: (name: string, value: Primitive, scope?: 'local' | 'global') => void;
    addArray: (name: string, value: ArrayType, type: SequenceType, scope?: 'local' | 'global') => void;
    updateVariable: (name: string, value: Variable, scope?: 'local' | 'global') => void;
    removeVariable: (name: string, scope?: 'local' | 'global') => void;
    clearVariables: (scope?: 'local' | 'global') => void;
    
    pushStackFrame: (functionName: string) => void;
    popStackFrame: () => void;
    clearStackTrace: () => void;
}

const PrimitiveVariable = ({ name, value }: { name: string, value: Primitive }) => 
{
    return (
        <div className="pl-[15px] py-0.5 relative whitespace-nowrap">
            <span className="text-[#0070c1] mr-1">{name}: </span>
            <span className={
                typeof value === 'number' 
                    ? "text-[#098658]"
                    : typeof value === 'boolean' 
                        ? "text-[#0000ff]" 
                        : "text-[#a31515]"
            }>
                {typeof value === 'string' ? `"${value}"` : String(value)}
            </span>
        </div>
    );
};

const ArrayVariable = ({ name, value, type }: { name: string, value: ArrayType, type: SequenceType }) =>
{
    const [expanded, setExpanded] = useState(false);
    
    // Check if this is a 2D array
    const is2DArray = useMemo(() => value.length > 0 && Array.isArray(value[0]), [value]);

    const previewText = useMemo(() => 
    {
        if (value.length === 0)
        {
            return '{}';
        }
        else if (value.length === 1)
        {
            return `{${value[0]}}`;
        }
        
        if (type === SequenceType.Stack)
        {
            return `{..., ${value[value.length - 1]}}`;
        }
        else if (type === SequenceType.Queue)
        {
            if (value.length === 2)
            {
                return `{${value[0]}, ${value[1]}}`;
            }

            return `{${value[0]}, ..., ${value[value.length - 1]}}`;
        }

        if (value.length > 0 && Array.isArray(value[0]))
        {
            return `Array[${value[0].length}][${value.length}]`;
        }
        
        return `{${value[0]}, ..., ${value[value.length - 1]}}`;
    }, [value, type]);
    
    return (
        <div className="py-0.5 relative whitespace-nowrap">
            <div
                className="flex items-center px-2 py-0.5 cursor-pointer hover:bg-[#e8e8e8]"
                onClick={() => setExpanded(!expanded)}
            >
                <span className={`inline-block w-4 h-4 leading-4 text-center transition-transform duration-100 text-xs text-[#767676] ${expanded ? 'rotate-90' : ''}`}>
                    ▶
                </span>
                <span className="text-[#0070c1] mr-1">{name}: </span>
                <span className="text-[#267f99]">
                    {previewText}
                </span>
            </div>
            
            {expanded && (
                <div className="pl-[15px] border-l border-dotted border-[#c0c0c0] ml-2">
                    {is2DArray ? (
                        // Render 2D array
                        (value as Primitive[][]).map((row: Primitive[], rowIndex: number) => (
                            <ArrayVariable key={rowIndex} name={`[${rowIndex}]`} value={row} type={SequenceType.Array} />
                        ))
                    ) : (
                        // Render 1D array
                        (value as Primitive[]).map((item: Primitive, index: number) => (
                            <PrimitiveVariable key={index} name={`[${index}]`} value={item} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

const Debugger = () => 
{
    const [variables, setVariables] = useState<DebuggerVariable[]>([]);
    const [stackTrace, setStackTrace] = useState<StackTraceEntry[]>([]);
    const stackVariablesRef = useRef<DebuggerVariable[][]>([]);
    const { animator } = useGraphTheory();

    // Expose methods through the imperative handle
    animator.debugger.setHandle({
        addPrimitive: (name: string, value: Primitive, scope: 'local' | 'global' = 'local') =>
        {
            setVariables(prev => [...prev, { id: uuidv7(), name, value, scope }]);
        },

        addArray: (name: string, value: ArrayType, type: SequenceType, scope: 'local' | 'global' = 'local') => 
        {
            setVariables(prev => [...prev, { id: uuidv7(), name, value, type, scope }]);
        },
        
        updateVariable: (name: string, value: Variable, scope: 'local' | 'global' = 'local') => 
        {
            setVariables(prev => prev.map(variable => variable.name === name && variable.scope === scope ? { ...variable, value } : variable));
        },
        
        removeVariable: (name: string, scope: 'local' | 'global' = 'local') => 
        {
            setVariables(prev => prev.filter(variable => variable.name !== name || variable.scope !== scope));
        },
        
        clearVariables: (scope?: 'local' | 'global') => 
        {
            if (scope) 
            {
                setVariables(prev => prev.filter(variable => variable.scope !== scope));
            }
            else
            {
                setVariables([]);
            }
        },

        // Stack trace methods
        pushStackFrame: (functionName: string) =>
        {
            setStackTrace(prev => [...prev, { id: uuidv7(), functionName }]);
            const locals = variables.filter(v => v.scope === 'local');
            const globals = variables.filter(v => v.scope === 'global');
            stackVariablesRef.current.push(locals);
            setVariables(globals);
        },
        popStackFrame: () =>
        {
            setStackTrace(prev => prev.slice(0, -1));
            const globals = variables.filter(v => v.scope === 'global');
            setVariables([...globals, ...stackVariablesRef.current.pop() ?? []]);
        },
        clearStackTrace: () =>
        {
            setStackTrace([]);
            setVariables([]);
            stackVariablesRef.current = [];
        }
    });

    // Render a single variable based on its type
    const renderVariable = (variable: DebuggerVariable) => 
    {
        const { id, name, value, type } = variable;
        
        if (!Array.isArray(value))
        {
            return <PrimitiveVariable key={id} name={name} value={value} />;
        }
        else if (Array.isArray(value))
        {
            return <ArrayVariable key={id} name={name} value={value} type={type ?? SequenceType.Array} />;
        }
        
        // Fallback for any other types
        return (
            <div key={id} className="py-0.5 relative whitespace-nowrap">
                <span className="text-[#0070c1] mr-1">{name}: </span>
                <span className="text-[#a31515]">[không rõ]</span>
            </div>
        );
    };

    // Render stack trace
    const renderStackTrace = () => 
    {
        if (stackTrace.length === 0) 
        {
            return <div className="p-2 italic text-[#767676]">Không có lời gọi hàm</div>;
        }

        return stackTrace.map((frame) => (
            <div key={frame.id} className="py-1 px-2 hover:bg-[#e8e8e8] cursor-pointer">
                <div className="text-[#795e26] font-medium">{frame.functionName}</div>
            </div>
        )).reverse(); // Show most recent call at the top
    };

    // Filter variables by scope
    const localVariables = useMemo(() => variables.filter(v => v.scope === 'local'), [variables]);
    const globalVariables = useMemo(() => variables.filter(v => v.scope === 'global'), [variables]);

    return (
        <div className="font-mono bg-[#ffffff] text-[#333333] border border-[#e0e0e0] rounded w-full h-full flex flex-col overflow-hidden">
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Local Variables Section */}
                <div className="flex flex-col flex-1 border-r border-[#e0e0e0]">
                    <div className="px-4 py-2 font-bold border-b border-[#e0e0e0] bg-[#f3f3f3]">
                        Biến cục bộ
                    </div>
                    <div className="overflow-auto flex-1">
                        {localVariables.length === 0 ? (<div className="p-2 italic text-[#767676]">Không có biến cục bộ</div>) : (localVariables.map(renderVariable))}
                    </div>
                </div>

                {/* Global Variables Section */}
                <div className="flex flex-col flex-1 border-r border-[#e0e0e0]">
                    <div className="px-4 py-2 font-bold border-b border-[#e0e0e0] bg-[#f3f3f3]">
                        Biến toàn cục
                    </div>
                    <div className="overflow-auto flex-1">
                        {globalVariables.length === 0 ? (<div className="p-2 italic text-[#767676]">Không có biến toàn cục</div>) : (globalVariables.map(renderVariable))}
                    </div>
                </div>

                {/* Stack Trace Section */}
                <div className="flex flex-col flex-1">
                    <div className="px-4 py-2 font-bold border-b border-[#e0e0e0] bg-[#f3f3f3]">
                        Ngăn xếp gọi hàm
                    </div>
                    <div className="overflow-auto flex-1">
                        {renderStackTrace()}
                    </div>
                </div>
            </div>
        </div>
    );
};

Debugger.displayName = 'Debugger';

export default Debugger;