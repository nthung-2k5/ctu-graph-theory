import { Popover, Tabs } from 'antd';
import VisualGraphComponent from '../components/VisualGraphComponent';
import MemoryGraphComponent from '../components/MemoryGraphComponent';
import { useAppSelector } from '../lib/context/hooks';
import { FaGear } from 'react-icons/fa6';
import GraphOption from './GraphOption';

export default function GraphDisplayTab() 
{
    const { animating } = useAppSelector(state => state.animation);
    return (
        <Tabs items={[
            {
                key: '1',
                label: 'Biểu diễn trực quan',
                children: <VisualGraphComponent/>,
            },
            {
                key: '2',
                label: 'Biểu diễn trong bộ nhớ',
                children: <MemoryGraphComponent/>,
                disabled: animating
            }
        ]} tabBarExtraContent={(
            <Popover content={<GraphOption/>} color='white' placement='bottom'>
                <FaGear className='text-xl'/>
            </Popover>
        )} className='expanded-tabs'/>
    );
}