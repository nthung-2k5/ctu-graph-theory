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

export default function AlgorithmsComponent() {
    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thuật toán',
            children: <Collapse items={algorithms.map((algo, index) => {
                return {
                    key: index.toString(),
                    label: `${index + 1}. ${algo}`,
                    children: <p>{"a"}</p>,
                }
            })} expandIconPosition='end'/>
        },
    ];

    return (
        <Tabs className='mx-2' items={tabs}/>
    );
}