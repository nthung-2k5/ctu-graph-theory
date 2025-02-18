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
import { PropsWithChildren, useMemo } from 'react';
import Title from 'antd/es/typography/Title';
import UndirectedConnected from '../lib/algorithms/UndirectedConnected';
import Cycle from '../lib/algorithms/Cycle';
import Bipartite from '../lib/algorithms/Bipartite';
import PseudoCode from './PseudoCode';
import { useNode } from './NodeContext';

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
    'Tìm cây khung vô hướng nhỏ nhất (Thuật toán Kruskal)',
    'Tìm cây khung vô hướng nhỏ nhất (Thuật toán Prim)',
    'Tìm cây khung có hướng nhỏ nhất (Thuật toán Chu-Liu/Edmonds)',
    'Tìm luồng cực đại trong mạng (Thuật toán Ford-Fulkerson)',
];

export const algos = [
    new BFS(),
    new RecursionDFS(),
    new StackDFS(),
    new UndirectedConnected(),
    new Cycle(),
    new Bipartite(),
];


const InvalidMessage = (props: PropsWithChildren) => 
{
    return (
        <div className="text-[red]">
            <CloseCircleOutlined className="me-2" />
            <span>{props.children}</span>
        </div>
    );
};

export default function AlgorithmsTab() 
{
    const { graph, animator, animating, setAnimating } = useGraph();
    // const [algorithm, setAlgorithm] = useState<GraphAlgorithm>(algos[0]);
    const { algorithm, setAlgorithm } = useNode();
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

    const animate = async (values: object) => 
    {
        // console.log(values);
        algorithm.numberOfStep = 0;
        algorithm.currentStep = 0;
        if (animating) 
        {
            animator.current.stop();
            setAnimating(false);
        }
        else 
        {
            const result = algorithm.run(graph, values);
            if (algorithm instanceof RecursionDFS) 
            {
                if ('_vertexCount' in graph) 
                {
                    const visited = new Array(graph._vertexCount).fill(false);
                    if ('startVertex' in values) 
                    {
                        algorithm.runCode(graph, values.startVertex, visited);
                    }
                }
                // console.log(algorithm.numberOfStep);
            }
            setAnimating(true);
            await animator.current.run(result);
            setAnimating(false);
        }
    };
    // console.log(algorithm.name);

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
                        layout="horizontal"
                        disabled={animating}
                        form={form}
                        onFinish={animate}
                        className="w-full h-full flex flex-col justify-start"
                        style={{overflowY: "auto", paddingRight: "8px"}}
                    >
                        <Title level={5}>{algorithm.name}</Title>
                        <div className="flex justify-between items-center">
                            {graph.vertexCount > 0 ? (
                                error.valid ? (algorithm.configNode(graph)) : (<InvalidMessage>{error.error}</InvalidMessage>)
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
                        <PseudoCode />
                    </Form>
                </div>
            ),
        },
    ];

    return <Tabs items={tabs} className="expanded-tabs" />;
}
