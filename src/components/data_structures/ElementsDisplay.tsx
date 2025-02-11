import { AnimatePresence, motion, Variants } from 'motion/react';

export type ElementType = string | number;

const DELTA = 20;

const variants: Variants = {
    hidden: { opacity: 0 },
    outVert: { y: -DELTA },
    inVert: { y: -DELTA },
    outHori: { x: -DELTA },
    inHori: { x: DELTA },
};

const ElementsDisplay = (props: { className?: string, alignment: 'vertical' | 'horizontal', items: { id: number, value: ElementType }[] }) =>
{
    return (
        <motion.ul className={props.className}>
            <AnimatePresence>
                {props.items.map(({value, id}) => (
                    <motion.li
                        variants={variants}
                        initial={['hidden', props.alignment === 'vertical' ? 'inVert' : 'inHori']}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={['hidden', props.alignment === 'vertical' ? 'outVert' : 'outHori']}
                        transition={{ ease: 'easeOut', duration: 0.3 }}
                        className='w-10 h-10 border flex justify-center items-center'
                        layout
                        key={id}
                    >
                        <span>{value}</span>
                    </motion.li>
                ))}
            </AnimatePresence>
        </motion.ul>
        
    )
};

export default ElementsDisplay;