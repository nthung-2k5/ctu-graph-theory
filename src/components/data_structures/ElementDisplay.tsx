import { Popover } from 'antd';
import { AnimatePresence, motion, usePresenceData } from 'motion/react';
import { ComponentPropsWithoutRef, forwardRef, ReactNode, useImperativeHandle, useMemo, useState } from 'react';
import { uuidv7 } from 'uuidv7';

export type ElementType = string | number;
export type Direction = 'up' | 'down' | 'left' | 'right';
const DELTA = 20;
const ANIMATION_DURATION = 200;

export type ElementDisplayHandle = {
    changeValue: (value: ElementType | undefined, direction: Direction) => Promise<void>;
};

const setDirection = (direction: 'up' | 'down' | 'left' | 'right', delta: number) => 
{
    switch (direction) 
    {
        case 'up':
            return { y: delta };
        case 'down':
            return { y: -delta };
        case 'left':
            return { x: delta };
        case 'right':
            return { x: -delta };
    }
}

const Element = forwardRef((props: { value: ElementType | undefined }, ref: React.Ref<HTMLSpanElement>) =>
{
    const direction = usePresenceData() as Direction;
    const animateDirection = useMemo(() =>
    {
        return {
            initial: setDirection(direction, DELTA),
            exit: setDirection(direction, -DELTA)
        }
    }, [direction]);

    return (
        <motion.span
            ref={ref}
            initial={{ ...animateDirection?.initial ?? {}, opacity: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ ...animateDirection?.exit ?? {}, opacity: 0 }}
            transition={{ ease: 'easeOut', duration: props.value ? ANIMATION_DURATION / 1000 : 0 }}
            className='text-center mx-auto my-auto'
        >
            {props.value ?? ''}
        </motion.span>
    )
});

const ElementDisplay = forwardRef<ElementDisplayHandle, { popoverTitle: string, popoverContent?: ReactNode | ((value: ElementType | undefined) => ReactNode) } & ComponentPropsWithoutRef<'div'>>((props, ref) => 
{
    const [animateDirection, setAnimateDirection] = useState<Direction>(null!);
    const [value, setValue] = useState<ElementType | undefined>(undefined);
    const [key, setKey] = useState(uuidv7());

    useImperativeHandle(ref, () => ({
        changeValue: async (value: ElementType | undefined, direction: Direction) => 
        {
            setAnimateDirection(direction);
            setValue(value);
            setKey(uuidv7());
            await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));
        }
    }));

    const { popoverTitle, popoverContent, ...rest } = props;

    return (
        <Popover title={popoverTitle} content={typeof popoverContent === 'function' ? popoverContent(value) : popoverContent} trigger='hover'>
            <div {...rest}>
                <AnimatePresence mode='wait' custom={animateDirection}>
                    <Element key={key} value={value}/>
                </AnimatePresence>
            </div>
        </Popover>
    )
});

export default ElementDisplay;