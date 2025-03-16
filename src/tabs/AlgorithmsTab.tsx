import { Button, ConfigProvider, Dropdown, Form, MenuProps, Modal, Space, Tabs, TabsProps } from 'antd';
import { CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import Title from 'antd/es/typography/Title';
import CodeBlock from './CodeBlock';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';
import { AvailableAlgorithms } from '../lib/context/GraphTheoryProvider';
import { useAppSelector } from '../lib/context/hooks';

const algorithms = [
    "Duyệt theo chiều rộng (BFS)",
    "Duyệt theo chiều sâu (DFS) bằng đệ quy",
    "Duyệt theo chiều sâu (DFS) bằng ngăn xếp",
    "Kiểm tra đồ thị phân đôi",
    "Tìm các bộ phận liên thông mạnh (Thuật toán Tarjan)",
    "Tìm đường đi ngắn nhất (Thuật toán Moore-Dijkstra)",
    "Tìm đường đi ngắn nhất (Thuật toán Bellman-Ford)",
    "Tìm đường đi ngắn nhất (Thuật toán Floyd-Warshall)",
    "Sắp xếp topology",
    "Xếp hạng đồ thị",
    "Tìm cây khung vô hướng nhỏ nhất (Thuật toán Kruskal)",
    "Tìm cây khung vô hướng nhỏ nhất (Thuật toán Prim)",
    // 'Tìm cây khung có hướng nhỏ nhất (Thuật toán Chu-Liu/Edmonds)', (không làm nổi)
    "Tìm luồng cực đại trong mạng (Thuật toán Ford-Fulkerson)",
];

const InvalidMessage = (props: PropsWithChildren) => {
    return (
        <div className="text-[red] mb-3">
            <CloseCircleOutlined className="mr-2" />
            <span>{props.children}</span>
        </div>
    );
};

export default function AlgorithmsTab() {
    const { algorithm, setAlgorithm, setConfig, predicateError, result } = useGraphTheory();
    const [form] = Form.useForm();
    const [openDialog, setOpenDialog] = useState(false);
    const graph = useAppSelector(state => state.graph);

    const items: MenuProps["items"] = useMemo(
        () =>
            AvailableAlgorithms.map((algo, index) => ({
                key: index,
                label: `${index + 1}. ${algo.name}`,
            })),
        []
    );

    const onClick: MenuProps["onClick"] = ({ key }: { key: string }) => {
        setAlgorithm(AvailableAlgorithms[parseInt(key)]);
    };

    useEffect(() => {
        if (predicateError !== null) {
            form.resetFields();
            return;
        }

        form.setFieldsValue(algorithm.defaultConfig());
    }, [graph, predicateError, algorithm, form]);

    useEffect(() => {
        if (predicateError !== null) return;

        setConfig(form.getFieldsValue());
    }, [graph, predicateError, setConfig, algorithm, form]);

    const tabs: TabsProps["items"] = [
        {
            key: "1",
            label: "Thuật toán",
            children: (
                <div className="h-full flex flex-col max-h-full">
                    <div>
                        <Dropdown trigger={["click"]} menu={{ items, onClick }}>
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
                        form={form}
                        onValuesChange={(_, values) => setConfig(values)}
                        className="w-full flex flex-col justify-start"
                    >
                        <Title level={5}>{algorithm.name}</Title>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Form: {
                                        itemMarginBottom: 8,
                                    },
                                },
                            }}
                        >
                            <div className="flex flex-col">
                                {predicateError ? (
                                    <InvalidMessage>{predicateError}</InvalidMessage>
                                ) : (
                                    algorithm.configNode()
                                )}
                            </div>
                        </ConfigProvider>
                    </Form>
                    <CodeBlock />
                    <Button
                        block
                        type="primary"
                        disabled={predicateError !== null}
                        onClick={() => setOpenDialog(true)}
                        className="mt-2"
                    >
                        Kết quả thuật toán
                    </Button>
                    <Modal
                        title="Kết quả thuật toán"
                        open={openDialog}
                        centered
                        destroyOnClose
                        onCancel={() => setOpenDialog(false)}
                        footer={
                            <Button type="primary" onClick={() => setOpenDialog(false)}>
                                Xong
                            </Button>
                        }
                    >
                        {<algorithm.Result result={result} />}
                    </Modal>
                </div>
            ),
        },
    ];

    return <Tabs items={tabs} className="expanded-tabs" />;
}
