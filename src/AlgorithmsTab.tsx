import { CloseCircleOutlined } from '@ant-design/icons';
import { Collapse, Tabs, TabsProps } from 'antd';

const algorithms = [
    'Duyệt theo chiều rộng (BFS)',
    'Duyệt theo chiều sâu (DFS) bằng đệ quy',
    'Duyệt theo chiều sâu (DFS) bằng ngăn xếp',
    'Kiểm tra đồ thị liên thông',
    'Kiểm tra đồ thị chứa chu trình',
    'Kiểm tra đồ thị phân đôi',
    'Tìm các bộ phận liên thông mạnh (Thuật toán Tarjan)',
    'Thuật toán Moore-Dijkstra',
]

export default function AlgorithmsTab() {
    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thuật toán',
            children: <Collapse items={algorithms.map((algo, index) => {
                return {
                    key: index.toString(),
                    label: `${index + 1}. ${algo}`,
                    children: <div className='text-[red]'>
                        <CloseCircleOutlined className='me-2'/>
                        <span>
                            Đồ thị phải là đồ thị vô hướng
                        </span>
                    </div>,
                }
            })} expandIconPosition='end'/>
        },
    ];

    return (
        <Tabs items={tabs} className='expanded-tabs'/>
    );
}