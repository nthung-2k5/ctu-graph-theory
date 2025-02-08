import {
    Button,
    ButtonProps,
    Dropdown,
    Form,
    Space,
    Tabs,
    TabsProps,
} from 'antd';
import { useGraph } from '../lib/GraphContext';
import BFS from '../lib/algorithms/traversal/BFS';
import { CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import RecursionDFS from '../lib/algorithms/traversal/RecursionDFS';
import StackDFS from '../lib/algorithms/traversal/StackDFS';
import { PropsWithChildren, useMemo, useState } from 'react';
import { GraphAlgorithm } from '../lib/algorithms/GraphAlgorithm';
import Title from 'antd/es/typography/Title';
import UndirectedConnected from '../lib/algorithms/UndirectedConnected';
import Cycle from '../lib/algorithms/Cycle';
import Bipartite from '../lib/algorithms/Bipartite';
import PseudoCode from './PseudoCode';

const algorithms = [
    'Duyệt theo chiều rộng (BFS)',
    'Duyệt theo chiều sâu (DFS) bằng đệ quy',
    'Duyệt theo chiều sâu (DFS) bằng ngăn xếp',
    'Kiểm tra đồ thị vô hướng liên thông',
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
    new StackDFS(),
    new UndirectedConnected(),
    new Cycle(),
    new Bipartite(),
];


const InvalidMessage = (props: PropsWithChildren) => {
    return (
        <div className="text-[red]">
            <CloseCircleOutlined className="me-2" />
            <span>{props.children}</span>
        </div>
    );
};

export default function AlgorithmsTab() {
    // if ('getInfo' in algos[1]) {
    //     console.log(algos[1].getInfo);
    // }
    const { graph, animator, animating, setAnimating } = useGraph();
    const [algorithm, setAlgorithm] = useState<GraphAlgorithm>(algos[0]);
    const [form] = Form.useForm();

    const items = algos.map((algo, index) => ({
        key: index,
        label: (
            <button
                type="button"
                onClick={() => setAlgorithm(algo)}
            >{`${index + 1}. ${algo.name}`}</button>
        ),
    }));

    const error = useMemo(
        () => algorithm.predicateCheck(graph),
        [algorithm, graph],
    );

    const animate = async (values: object) => {
        if (animating) {
            animator.current.stop();
            setAnimating(false);
        } else {
            const result = algorithm.run(graph, values);
            setAnimating(true);
            await animator.current.run(result);
            setAnimating(false);
        }
    };

    const runProps: ButtonProps = {
        htmlType: 'submit',
        disabled: !graph.vertexCount || !error.valid,
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
                <div className="h-full flex flex-col">
                    <div>
                        <Dropdown
                            trigger={['click']}
                            disabled={animating}
                            menu={{ items }}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    Chọn thuật toán
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <Form
                        layout="vertical"
                        disabled={animating}
                        form={form}
                        onFinish={animate}
                        className="w-full h-full flex flex-col justify-start"
                        style={{overflowY: "auto", paddingRight: "8px"}}
                    >
                        <Title level={5}>{algorithm.name}</Title>
                        <div className="flex justify-between items-center">
                            {graph.vertexCount > 0 ? (
                                error.valid ? (
                                    algorithm.configNode(graph)
                                ) : (
                                    error.errors?.map((err) => (
                                        <InvalidMessage>{err}</InvalidMessage>
                                    ))
                                )
                            ) : (
                                <InvalidMessage>
                                    Đồ thị không được rỗng
                                </InvalidMessage>
                            )}
                            <Button
                                block
                                type="primary"
                                {...(animating ? stopProps : runProps)}
                                style={{ height: '40px', width: '80px' }}
                            />
                        </div>
                        {/* Mã giả */}
                        <PseudoCode />
                    </Form>
                </div>
            ),
            // children: <Button onClick={async () =>
            // {
            //     const result = new BFS().run(graph as UnweightedGraph);
            //     await animator.current.run(result);
            // }}>Test</Button>
        },
    ];

    return <Tabs items={tabs} className="expanded-tabs" />;
}
