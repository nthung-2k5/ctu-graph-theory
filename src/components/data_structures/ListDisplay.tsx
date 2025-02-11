import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ElementDisplay, { ElementDisplayHandle, ElementType } from './ElementDisplay';
import { uuidv7 } from 'uuidv7';

export type ListDisplayHandle = {
    pushBack: (value: ElementType) => void;
    popBack: () => void;
}

function resize<T>(arr: T[], newSize: number, newValue: T | ((index: number) => T))
{
    if (arr.length > newSize)
    {
        arr.slice(0, newSize);
        return arr;
    }

    for (let i = arr.length; i < newSize; i++)
    {
        arr.push(newValue instanceof Function ? newValue(i) : newValue);
    }

    return arr;
}

const ListDisplay = forwardRef<ListDisplayHandle, { length: number }>((props, ref) =>
{
    const [length, setLength] = useState(0);
    const elementRefs = useRef<(ElementDisplayHandle | null)[]>(Array(props.length).fill(null));
    const createElement = (index: number) => (<ElementDisplay key={uuidv7()} ref={r => elementRefs.current[index] = r} popoverTitle={`Phần tử[${index}]`} popoverContent={(value) => `Giá trị: ${value ?? "Không có"}`} className='element-box'/>);

    const [elements, setElements] = useState<ReactNode[]>(Array.from({ length: props.length }, (_, index) => createElement(index)));

    useImperativeHandle(ref, () => ({
        pushBack: (value: ElementType) =>
        {
            elementRefs.current[length]?.changeValue(value, 'down');
            setLength(length + 1);
        },

        popBack: () =>
        {
            elementRefs.current[Math.max(0, length - 1)]?.changeValue(undefined, 'up');
            setLength(Math.max(0, length - 1));
        }
    }));

    useEffect(() =>
    {
        elementRefs.current = resize(elementRefs.current, props.length, null!);
        setElements(e => resize(e, props.length, createElement));
    }, [props.length]);

    return (
        <div className='flex flex-col scrollbar-thin overflow-hidden hover:overflow-x-auto max-w-full min-h-20'>
            <div>
                <span>Danh sách (Số phần tử:&nbsp;</span><strong>{length}</strong>)<br/>
            </div>
            <div className='flex'>
                {elements}
            </div>
        </div>
    );
});

export default ListDisplay;