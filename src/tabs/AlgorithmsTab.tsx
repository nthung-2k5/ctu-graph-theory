import {
    ConfigProvider,
    // Button,
    // ButtonProps,
    Dropdown,
    Form,
    Space,
    Tabs,
    TabsProps,
} from 'antd';
import { CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import { PropsWithChildren, useMemo } from 'react';
import Title from 'antd/es/typography/Title';
import PseudoCode from './PseudoCode';
import { useAppDispatch, useAppSelector } from '../lib/context/hooks';
import { start, stop } from '../lib/context/animationSlice';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';
import { AvailableAlgorithms } from '../lib/context/GraphTheoryProvider';

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


const InvalidMessage = (props: PropsWithChildren) => 
{
    return (
        <div className="text-[red] mb-3">
            <CloseCircleOutlined className="mr-2" />
            <span>{props.children}</span>
        </div>
    );
};

export default function AlgorithmsTab() 
{
    const { directed, edges, vertexCount } = useAppSelector(state => state.graph);
    const { animating } = useAppSelector(state => state.animation);
    const dispatch = useAppDispatch();
    const { algorithm, setAlgorithm } = useGraphTheory();
    const [form] = Form.useForm();

    const items = AvailableAlgorithms.map((algo, index) => ({
        key: index,
        label: (
            <button
                type="button"
                onClick={() => setAlgorithm(algo)}
            >{`${index + 1}. ${algo.name}`}</button>
        ),
    }));

    const error = useMemo(() => 
    {
        const predicate = algorithm.predicate;

        if (vertexCount === 0)
        {
            return { valid: false, error: 'Đồ thị không được rỗng' };
        }

        if (predicate.directed !== undefined && predicate.directed !== directed) 
        {
            return { valid: false, error: `Đồ thị phải là đồ thị ${ predicate.directed ? "có" : "vô" } hướng` };
        }
        
        if (predicate.weighted !== undefined && (edges.length === 0 || predicate.weighted !== 'weight' in edges[0]))
        {
            return { valid: false, error: `Đồ thị phải ${ predicate.weighted ? "có" : "không" } trọng số` };
        }

        // TODO: Check for acyclic graph
        // if (predicate.acyclic !== undefined && predicate.acyclic !== edges.acyclic) 
        // {
        //     return { valid: false, error: `Đồ thị không được có chu trình` };
        // }

        return { valid: true };
        
    }, [algorithm, directed, edges, vertexCount]);

    const animate = async (values: object) => 
    {
        dispatch(animating ? stop() : start());
    };

    // const runProps: ButtonProps = {
    //     htmlType: 'submit',
    //     disabled: !vertexCount || !error.valid,
    //     children: 'Chạy',
    // };

    // const stopProps: ButtonProps = {
    //     htmlType: 'submit',
    //     danger: true,
    //     disabled: false,
    //     children: 'Dừng',
    // };

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thuật toán',
            children: (
                <div className="h-full flex flex-col max-h-full">
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
                        className="w-full flex flex-col justify-start"
                    >
                        <Title level={5}>{algorithm.name}</Title>
                        <ConfigProvider theme={{
                            components: {
                                Form: {
                                    itemMarginBottom: 8
                                }
                            }
                        }}>
                            <div className="flex flex-col">
                                {error.valid ? (algorithm.configNode(vertexCount)) : (<InvalidMessage>{error.error}</InvalidMessage>)}
                                {/* <Button
                                block
                                type="primary"
                                {...(animating ? stopProps : runProps)}
                                style={{ height: '40px', width: '80px' }}
                            /> */}
                            </div>
                        </ConfigProvider>
                    </Form>
                    <PseudoCode />
                </div>
            ),
        },
    ];

    return <Tabs items={tabs} className="expanded-tabs" />;
}
