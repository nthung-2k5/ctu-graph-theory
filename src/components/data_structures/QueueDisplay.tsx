import { Queue } from 'data-structure-typed';
import { forwardRef, useImperativeHandle, useReducer, useRef } from 'react';
import { ElementType } from './ElementsDisplay';
import ElementDisplay, { ElementDisplayHandle } from './ElementDisplay';

export type QueueDisplayHandle = {
    push: (value: ElementType) => void;
    pop: () => void;
}

const QueueDisplay = forwardRef<QueueDisplayHandle, unknown>((_, ref) =>
{
    const queue = useRef(new Queue<ElementType>());
    const [, forceUpdate] = useReducer(o => !o, false);
    
    const firstRef = useRef<ElementDisplayHandle>(null!);
    const lastRef = useRef<ElementDisplayHandle>(null!);
    
    useImperativeHandle(ref, () => ({
        push: (value: ElementType) =>
        {
            const q = queue.current;
            q.push(value);

            if (q.length === 1)
            {
                firstRef.current.changeValue(q.first, 'left');
            }
            
            lastRef.current.changeValue(q.last, 'left');
            forceUpdate();
        },

        pop: () =>
        {
            const q = queue.current;
            q.shift();
            
            firstRef.current.changeValue(q.first, 'left');

            if (q.length === 0)
            {
                lastRef.current.changeValue(q.last, 'left');
            }
            forceUpdate();
        }
    }));

    return (
        <div className='flex flex-col scrollbar-thin overflow-hidden hover:overflow-x-auto max-w-full min-h-20'>
            <div>
                <span>Hàng đợi (Số phần tử:&nbsp;</span><strong>{queue.current.length}</strong>)<br/>
            </div>
            <div className='flex'>
                <ElementDisplay popoverTitle='Đầu hàng đợi' popoverContent={(value) => `Giá trị: ${value ?? "Không có"}`} ref={firstRef} className='element-box'/>
                <div className='flex items-center mx-2 w-full'>
                    <div className='w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-gray-400 border-b-8 border-b-transparent'></div>
                    <div className='flex-grow h-1 bg-gray-400'></div>
                </div>
                <ElementDisplay popoverTitle='Cuối hàng đợi' popoverContent={(value) => `Giá trị: ${value ?? "Không có"}`} ref={lastRef} className='element-box'/>
            </div>
        </div>
    );
});

export default QueueDisplay;