import { Tabs } from 'antd';
import VisualGraphComponent from '../components/VisualGraphComponent';
import MemoryGraphComponent from '../components/MemoryGraphComponent';

export default function GraphDisplayTab() 
{
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
            }
        ]}
        className='expanded-tabs'/>
    );
}