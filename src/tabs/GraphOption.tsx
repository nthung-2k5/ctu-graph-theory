import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "antd";
import { useNode } from "./NodeContext";

export default function GraphOption() {
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

  const handleNodeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setNodeColor(color);
  };

  const handleEdgeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setEdgeColor(color);
  };

  const handleTextNumberColor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const color = e.target.value;
    setTextNumberColor(color);
  }

  return (
    <>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "0.5rem",
          borderWidth: "1px",
          // borderColor: '#000',
          width: "100%",
          height: "260px",
          padding: "15px 30px",
        }}
      >
        <Row className="mb-[10px]">
          <Col span={12} className="flex items-center">
            <p className="option-text">
              <FontAwesomeIcon icon={faQuestion} className="option-icon" />
              Bán kính nút
            </p>
          </Col>
          <Col span={12} className="flex items-center justify-center">
            <input
              type="range"
              min="20"
              max="60"
              value={nodeRadius}
              className="input-range"
              onChange={(e) => setNodeRadius(Number(e.target.value))}
              style={{width: "100px"}}
            />
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
            <input
              type="range"
              min="50"
              max="250"
              value={edgeLength}
              className="input-range"
              onChange={(e) => setEdgeLength(Number(e.target.value))}
              style={{width: "100px"}}
            />
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
            <input
              type="color"
              name="color-node"
              className="option-input-color"
              value={nodeColor}
              onChange={handleNodeColorChange}
            ></input>
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
            <input
              type="color"
              name="color-edge"
              className="option-input-color"
              value={edgeColor}
              onChange={handleEdgeColorChange}
            ></input>
          </Col>
        </Row>
        <Row className="mb-[10px]">
          <Col span={12} className="flex items-center">
            <p className="option-text">
              <FontAwesomeIcon icon={faQuestion} className="option-icon" />
              Màu số
            </p>
          </Col>
          <Col span={12} className="flex items-center justify-center">
            <select 
              name="color-text-node" 
              id="colorTextNode"
              value={textNumberColor}
              onChange={handleTextNumberColor}
              style={{width: '100px', border: '1px solid #ccc'}}
            >
              <option value="#000000">Màu đen</option>
              <option value="#ffffff">Màu trắng</option>
            </select>
          </Col>
        </Row>
        <button className="option-button" onClick={downloadPNG}>Tải xuống dưới dạng PNG</button>
      </div>
    </>
  );
}
