import { Stack } from 'data-structure-typed';
import { forwardRef, useImperativeHandle, useReducer, useRef } from 'react';
import { ElementType } from './ElementsDisplay';
import ElementDisplay, { ElementDisplayHandle } from './ElementDisplay';

export type StackDisplayHandle = {
    push: (value: ElementType) => void;
    pop: () => void;
}

const StackDisplay = forwardRef<StackDisplayHandle>((_, ref) =>
{
    const stack = useRef(new Stack<ElementType>());
    const [, forceUpdate] = useReducer(o => !o, false);
    const topStack = useRef<ElementDisplayHandle>(null!);
    const bottomStack = useRef<ElementDisplayHandle>(null!);
    
    useImperativeHandle(ref, () => ({
        push: (value: ElementType) =>
        {
            const s = stack.current;
            s.push(value);

            if (s.elements.length === 1)
            {
                bottomStack.current.changeValue(s.peek(), 'left');
            }
            
            topStack.current.changeValue(s.peek(), 'left');
            forceUpdate();
        },

        pop: () =>
        {
            const s = stack.current;
            s.pop();

            topStack.current.changeValue(s.peek(), 'right');

            if (s.elements.length === 0)
            {
                bottomStack.current.changeValue(undefined, 'right');
            }
            forceUpdate();
        }
    }));


    return (
        <div className={`flex flex-col scrollbar-thin overflow-y-hidden max-w-full min-h-20`}>
            <div>
                <span>Ngăn xếp (Số phần tử:&nbsp;</span><strong>{stack.current.elements.length}</strong>)
            </div>
            <div className='flex'>
                <ElementDisplay popoverTitle='Đáy ngăn xếp' popoverContent={(value) => `Giá trị: ${value ?? "Không có"}`} ref={bottomStack} className='element-box'/>
                <div className='flex items-center mx-2 w-full'>
                    <div className='flex-grow h-1 bg-gray-400'></div>
                    <div className='w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-gray-400 border-b-8 border-b-transparent'></div>
                </div>
                <ElementDisplay popoverTitle='Đỉnh ngăn xếp' popoverContent={(value) => `Giá trị: ${value ?? "Không có"}`} ref={topStack} className='element-box'/>
            </div>
        </div>
    );
});

export default StackDisplay;