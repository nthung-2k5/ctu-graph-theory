import "../index.css";
import { FaQuestion } from "react-icons/fa6";
import { Col, ColorPicker, Row, Slider } from "antd";
import { useAppDispatch, useAppSelector } from '../lib/context/hooks';
import { setEdgeColor, setEdgeLength, setLabelColor, setNodeColor, setNodeRadius } from '../lib/context/graphConfigSlice';

export default function GraphOption() 
{
    const { nodeColor, edgeColor, labelColor, nodeRadius, edgeLength } = useAppSelector((state) => state.config);
    const dispatch = useAppDispatch();

    return (
        <div className='bg-white rounded-lg border min-w-72 px-6 py-4'>
            <Row className="mb-[10px]">
                <Col span={12} className="flex items-center">
                    <p className="option-text">
                        <FaQuestion className="option-icon" />
                        Bán kính nút
                    </p>
                </Col>
                <Col span={12} className="flex items-center justify-end">
                    <Slider min={20} max={60} value={nodeRadius} onChange={(value) => dispatch(setNodeRadius(value))} className='w-full' />
                </Col>
            </Row>
            <Row className="mb-[10px]">
                <Col span={12} className="flex items-center">
                    <p className="option-text">
                        <FaQuestion className="option-icon" />
                        Độ dài cung
                    </p>
                </Col>
                <Col span={12} className="flex items-center justify-center">
                    <Slider min={50} max={250} value={edgeLength} onChange={(value) => dispatch(setEdgeLength(value))} className='w-full' />
                </Col>
            </Row>
            <Row className="mb-[10px]">
                <Col span={12} className="flex items-center">
                    <p className="option-text">
                        <FaQuestion className="option-icon" />
                        Màu nút
                    </p>
                </Col>
                <Col span={12} className="flex items-center">
                    <ColorPicker value={nodeColor} onChangeComplete={(value) => { dispatch(setNodeColor(value.toCssString())); }} showText />
                </Col>
            </Row>
            <Row className="mb-[10px]">
                <Col span={12} className="flex items-center">
                    <p className="option-text">
                        <FaQuestion className="option-icon" />
                        Màu cạnh
                    </p>
                </Col>
                <Col span={12} className="flex items-center">
                    <ColorPicker value={edgeColor} onChangeComplete={(value) => dispatch(setEdgeColor(value.toCssString()))} showText />
                </Col>
            </Row>
            <Row>
                <Col span={12} className="flex items-center">
                    <p className="option-text">
                        <FaQuestion className="option-icon" />
                        Màu số
                    </p>
                </Col>
                <Col span={12} className="flex items-center">
                    <ColorPicker value={labelColor} onChangeComplete={(value) => dispatch(setLabelColor(value.toCssString()))} showText />
                </Col>
            </Row>
        </div>
    );
}
