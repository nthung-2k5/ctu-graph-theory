import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import "prism-react-editor/prism/languages/c"

import "prism-react-editor/layout.css"
import "prism-react-editor/themes/github-light.css"

// Required by the basic setup
import "prism-react-editor/search.css"
import GraphInput from './GraphInput';
import { UnweightedGraph } from './lib/Graph';
const LeftComponent = ({onGraphChanged}: Partial<{onGraphChanged: (graph: UnweightedGraph) => void}>) => {

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Đồ thị',
            children: <GraphInput onGraphChanged={onGraphChanged}/>
        },
        {
            key: '2',
            label: 'Cài đặt đồ thị',
        },
    ];

    return (
        <Tabs className='mx-2' items={tabs}/>
    );
};

export default LeftComponent;