import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faCaretLeft,
  faCaretRight,
  faForwardStep,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

export default function ControlBar() {
  return (
    <div className="control-bar-container flex justify-between items-center">
      <div className="control-bar__speed flex justify-between items-center w-[110px]">
        <input
          type="range"
          min="1"
          max="5"
          className="input-range"
          style={{
            width: "80px",
            background: "linear-gradient(to right, #ffffff 0%, #ffffff 100%)",
            backgroundSize: "80px 3px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <p className="control-bar__seed-number">3X</p>
      </div>

      <div className="control-bar__play flex justify-between items-center h-[100%]">
        <FontAwesomeIcon icon={faBackwardStep} className="control-bar__icon"/>
        <FontAwesomeIcon icon={faCaretLeft} className="control-bar__icon" />
        <FontAwesomeIcon icon={faPause} className="control-bar__icon" />
        {/* <FontAwesomeIcon icon={faPlay} className="control-bar__icon" /> */}
        <FontAwesomeIcon icon={faCaretRight} className="control-bar__icon" />
        <FontAwesomeIcon icon={faForwardStep} className="control-bar__icon" />
      </div>
      
      <div className="control-bar__progress flex items-center">
        <input
          type="range"
          min="1"
          max="20"
          className="input-range"
          style={{
            width: "275px",
            background: "linear-gradient(to right, #ffffff 0%, #ffffff 100%)",
            backgroundSize: "300px 7px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></input>
      </div>
    </div>
  );
}
