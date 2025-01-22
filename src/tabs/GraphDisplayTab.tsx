import { Tabs } from 'antd';
import VisualGraphComponent from '../components/VisualGraphComponent';
import MemoryGraphComponent from '../components/MemoryGraphComponent';
import { useGraph } from '../lib/GraphContext';

export default function GraphDisplayTab() 
{
    const { animating } = useGraph();
    return (
        <Tabs items={[
            {
                key: '1',
                label: 'Biểu diễn trực quan',
                children: <VisualGraphComponent/>,
                destroyInactiveTabPane: true
            },
            {
                key: '2',
                label: 'Biểu diễn trong bộ nhớ',
                children: <MemoryGraphComponent/>,
                disabled: animating
            }
        ]} className='expanded-tabs'/>
    );
}