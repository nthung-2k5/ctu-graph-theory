import { Tabs } from 'antd';
import VisualGraphComponent from '../components/VisualGraphComponent';
import MemoryGraphComponent from '../components/MemoryGraphComponent';
// import { FaGear } from 'react-icons/fa6';
// import GraphOption from './GraphOption';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';

export default function GraphDisplayTab() 
{
    const { playing } = useGraphTheory();

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
                disabled: playing
            }
        ]}
        // tabBarExtraContent={(
        //     <Popover content={<GraphOption/>} color='white' placement='bottom'>
        //         <FaGear className='text-xl'/>
        //     </Popover>
        // )}
        className='expanded-tabs'/>
    );
}