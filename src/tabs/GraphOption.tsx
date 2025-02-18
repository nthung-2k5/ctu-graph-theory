import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, ColorPicker, Row, Slider } from "antd";
import { useNode } from "./NodeContext";

export default function GraphOption() 
{
    const {
        nodeColor,
        edgeColor,
        textNumberColor,
        setNodeColor,
        setEdgeColor,
        setTextNumberColor,
        nodeRadius,
        setNodeRadius,
        edgeLength,
        setEdgeLength,
        downloadPNG
    } = useNode();

    return (
        <div className='bg-white rounded-lg border w-full px-8 py-4'>
            <Row className="mb-[10px]">
                <Col span={12} className="flex items-center">
                    <p className="option-text">
                        <FontAwesomeIcon icon={faQuestion} className="option-icon" />
                        Bán kính nút
                    </p>
                </Col>
                <Col span={12} className="flex items-center justify-center">
                    <Slider min={20} max={60} value={nodeRadius} onChange={setNodeRadius} className='w-full' />
                </Col>
            </Row>
            <Row className="mb-[10px]">
                <Col span={12} className="flex items-center">
                    <p className="option-text">
                        <FontAwesomeIcon icon={faQuestion} className="option-icon" />
                        Độ dài cung
                    </p>
                </Col>
                <Col span={12} className="flex items-center justify-center">
                    <Slider min={50} max={250} value={edgeLength} onChange={setEdgeLength} className='w-full' />
                </Col>
            </Row>
            <Row className="mb-[10px]">
                <Col span={12} className="flex items-center">
                    <p className="option-text">
                        <FontAwesomeIcon icon={faQuestion} className="option-icon" />
                        Màu nút
                    </p>
                </Col>
                <Col span={12} className="flex items-center">
                    <ColorPicker value={nodeColor} onChangeComplete={setNodeColor} showText />
                </Col>
            </Row>
            <Row className="mb-[10px]">
                <Col span={12} className="flex items-center">
                    <p className="option-text">
                        <FontAwesomeIcon icon={faQuestion} className="option-icon" />
                        Màu cạnh
                    </p>
                </Col>
                <Col span={12} className="flex items-center">
                    <ColorPicker value={edgeColor} onChangeComplete={setEdgeColor} showText />
                </Col>
            </Row>
            <Row className="mb-[10px]">
                <Col span={12} className="flex items-center">
                    <p className="option-text">
                        <FontAwesomeIcon icon={faQuestion} className="option-icon" />
                        Màu số
                    </p>
                </Col>
                <Col span={12} className="flex items-center">
                    <ColorPicker value={textNumberColor} onChangeComplete={setTextNumberColor} showText />
                </Col>
            </Row>
            <Button className='w-full' type='primary' onClick={downloadPNG}>Tải xuống dưới dạng PNG</Button>
        </div>
    );
}
