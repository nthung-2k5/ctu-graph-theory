import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "antd";
import { useColor, useNode } from "./NodeContext";

export default function GraphOption() {
  const { nodeColor, edgeColor, setNodeColor, setEdgeColor } = useColor();
  const { nodeRadius, setNodeRadius, edgeLength, setEdgeLength } = useNode();

  const handleNodeColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const color = e.target.value;
    setNodeColor(color);
  };

  const handleEdgeColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const color = e.target.value;
    setEdgeColor(color);
  };

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
          padding: "20px 30px",
        }}
      >
        <Row className="mb-[10px]">
          <Col span={12}>
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
              onChange={(e) => setNodeRadius(Number(e.target.value))}
              style={{width: "100px"}}
            />
          </Col>
        </Row>
        <Row className="mb-[10px]">
          <Col span={12}>
            <p className="option-text">
              <FontAwesomeIcon icon={faQuestion} className="option-icon" />
              Độ dài cung
            </p>
          </Col>
          <Col span={12} className="flex items-center justify-center">
            <input
              type="range"
              min="20"
              max="60"
              value={edgeLength}
              onChange={(e) => setEdgeLength(Number(e.target.value))}
              style={{width: "100px"}}
            />
          </Col>
        </Row>
        <Row className="mb-[10px]">
          <Col span={12}>
            <p className="option-text">
              <FontAwesomeIcon icon={faQuestion} className="option-icon" />
              Màu nút
            </p>
          </Col>
          <Col span={12}>
            <select
              className="option-input-select"
              value={nodeColor}
              onChange={handleNodeColorChange}
            >
              <option value="Màu đen">Màu đen</option>
              <option value="Màu đỏ">Màu đỏ</option>
              <option value="Màu cam">Màu cam</option>
              <option value="Màu hồng">Màu hồng</option>
              <option value="Màu xanh">Màu xanh</option>
            </select>
          </Col>
        </Row>
        <Row className="mb-[10px]">
          <Col span={12}>
            <p className="option-text">
              <FontAwesomeIcon icon={faQuestion} className="option-icon" />
              Màu cạnh
            </p>
          </Col>
          <Col span={12}>
            <select
              className="option-input-select"
              value={edgeColor}
              onChange={handleEdgeColorChange}
            >
              <option value="Màu đen">Màu đen</option>
              <option value="Màu đỏ">Màu đỏ</option>
              <option value="Màu cam">Màu cam</option>
              <option value="Màu hồng">Màu hồng</option>
              <option value="Màu xanh">Màu xanh</option>
            </select>
          </Col>
        </Row>
        <button className="option-button">Tải xuống dưới dạng PNG</button>
      </div>
    </>
  );
}
