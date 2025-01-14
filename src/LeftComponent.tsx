import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import "prism-react-editor/prism/languages/c"

import "prism-react-editor/layout.css"
import "prism-react-editor/themes/github-light.css"

// Required by the basic setup
import "prism-react-editor/search.css"
import GraphInput from './GraphInput';

const tabs: TabsProps['items'] = [
    {
        key: '1',
        label: 'Đồ thị',
        children: <GraphInput/>
    },
    {
        key: '2',
        label: 'Cài đặt đồ thị',
    },
]
const LeftComponent = () => {
    return (
        <Tabs className='mx-2' items={tabs}/>
    );
};

export default LeftComponent;