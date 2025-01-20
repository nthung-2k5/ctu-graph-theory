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
    'Tìm đường đi ngắn nhất (Thuật toán Moore-Dijkstra)',
    'Tìm đường đi ngắn nhất (Thuật toán Bellman-Ford)',
    'Tìm đường đi ngắn nhất (Thuật toán Floyd-Warshall)',
    'Sắp xếp topology',
    'Xếp hạng đồ thị',
    'Tìm cây khung nhỏ nhất (Thuật toán Kruskal)',
    'Tìm cây khung nhỏ nhất (Thuật toán Prim)',
    'Tìm cây khung nhỏ nhất (Thuật toán Ford-Fulkerson/Edmonds-Karp)',
];

export default function AlgorithmsTab() 
{
    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thuật toán',
            children: <Collapse items={algorithms.map((algo, index) => ({
                key: index.toString(),
                label: `${index + 1}. ${algo}`,
                children: <div className='text-[red]'>
                    <CloseCircleOutlined className='me-2'/>
                    <span>
                        Đồ thị phải là đồ thị vô hướng
                    </span>
                </div>,
            }))} expandIconPosition='end' className='h-full scrollbar-thin overflow-y-auto'/>
        },
    ];

    return (
        <Tabs items={tabs} className='expanded-tabs'/>
    );
}