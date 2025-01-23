import { Button, ButtonProps, Dropdown, Form, Space, Tabs, TabsProps } from 'antd';
import { useGraph } from '../lib/GraphContext';
import BFS from '../lib/algorithms/traversal/BFS';
import { CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import RecursionDFS from '../lib/algorithms/traversal/RecursionDFS';
import StackDFS from '../lib/algorithms/traversal/StackDFS';
import { PropsWithChildren, useState } from 'react';
import { GraphAlgorithm } from '../lib/algorithms/GraphAlgorithm';
import Title from 'antd/es/typography/Title';

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
    'Tìm luồng cực đại trong mạng (Thuật toán Ford-Fulkerson)',
];

const algos = [
    new BFS(),
    new RecursionDFS(),
    new StackDFS()
];

const InvalidMessage = (props: PropsWithChildren) =>
{
    return (
        <div className='text-[red]'>
            <CloseCircleOutlined className='me-2' />
            <span>
                {props.children}
            </span>
        </div>
    )
}

export default function AlgorithmsTab() {
    const { graph, animator, animating, setAnimating } = useGraph();
    const [algorithm, setAlgorithm] = useState<GraphAlgorithm>(algos[0]);
    const [form] = Form.useForm();

    const items = algos.map((algo, index) => (
        {
            key: index,
            label: (<button type='button' onClick={() => setAlgorithm(algo)}>{`${index + 1}. ${algo.name}`}</button>)
        }
    ));

    const animate = async (values: object) =>
    {
        if (animating)
        {
            animator.current.stop();
            setAnimating(false);
        }
        else
        {
            const result = algorithm.run(graph, values);
            setAnimating(true);
            await animator.current.run(result);
            setAnimating(false);
        }
    }

    const runProps: ButtonProps = {
        htmlType: 'submit',
        disabled: !graph.vertexCount,
        children: 'Chạy',
    };

    const stopProps: ButtonProps = {
        htmlType: 'submit',
        danger: true,
        disabled: false,
        children: 'Dừng',
    };

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thuật toán',
            // children: <Collapse items={algorithms.map((algo, index) => ({
            //     key: index.toString(),
            //     label: `${index + 1}. ${algo}`,
            //     children: <div className='text-[red]'>
            //         <CloseCircleOutlined className='me-2'/>
            //         <span>
            //             Đồ thị phải là đồ thị vô hướng
            //         </span>
            //     </div>,
            // }))} expandIconPosition='end' className='h-full scrollbar-thin overflow-y-auto'/>
            children: (
                <div className='h-full flex flex-col'>
                    <div>
                        <Dropdown trigger={['click']} disabled={animating} menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    Chọn thuật toán
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <Form layout='vertical' disabled={animating} form={form} onFinish={animate} className='flex-grow w-full h-full flex flex-col'>
                        <div className='flex-grow'>
                            <Title level={5}>{algorithm.name}</Title>
                            {graph.vertexCount > 0 ? algorithm.configNode(graph) : (<InvalidMessage>Đồ thị không được rỗng</InvalidMessage>)}
                        </div>
                        <Button block type='primary' {...(animating ? stopProps : runProps)} />
                    </Form>
                </div>
            )
            // children: <Button onClick={async () =>
            // {
            //     const result = new BFS().run(graph as UnweightedGraph);
            //     await animator.current.run(result);
            // }}>Test</Button>
        },
    ];

    return (
        <Tabs items={tabs} className='expanded-tabs' />
    );
}