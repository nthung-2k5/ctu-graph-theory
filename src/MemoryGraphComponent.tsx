import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import { useState } from 'react';

const graphTypes = ["Danh sách cạnh", "Ma trận kề", "Danh sách kề", "Ma trận liên thuộc"];
const graphItems: MenuProps['items'] = graphTypes.map((val, i) => {
    return { label: <span>{val}</span>, key: i.toString() };
});

export default function MemoryGraphComponent() {
    const [graphType, setGraphType] = useState(0);

    return (
        <div className='flex flex-col h-full'>
            <Dropdown menu={{ items: graphItems, onClick: ({key}) => setGraphType(parseInt(key))}} trigger={["click"]}>
                <a className='ant-dropdown-link mb-2' onClick={e => e.preventDefault()}>
                    Cách biểu diễn: {graphTypes[graphType]}{' '}<DownOutlined/>
                </a>
            </Dropdown>
            <div className='border-2 border-black rounded flex-grow'>
                
            </div>
        </div>
    );
}