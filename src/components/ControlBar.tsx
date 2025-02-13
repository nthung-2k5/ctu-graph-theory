import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faCaretLeft,
  faCaretRight,
  faForwardStep,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import GraphAnimator from "../lib/GraphAnimator";
import { MutableRefObject, useState } from "react";
import { useNode } from "../tabs/NodeContext";

interface ControlBarProps {
  animator: MutableRefObject<GraphAnimator>;
}

export default function ControlBar({ animator }: ControlBarProps) {

  const [ timeDelay, setTimeDelay ] = useState(4);
  const [ isPlay, setIsPlay ] = useState(true); 
  const { algorithm, setAlgorithm, range, setRange } = useNode();
  console.log(algorithm.currentStep);

  const handleTimeDelay = (e: any) => {
    switch (e.target.value) {
      case '1':
        animator.current.setDelay(2650);
        break;
      case '2':
        animator.current.setDelay(2000);
        break;
      case '3':
        animator.current.setDelay(1400);
        break;
      case '4':
        animator.current.setDelay(900);
        break;
      case '5':
        animator.current.setDelay(600);
        break;
      case '6':
        animator.current.setDelay(300);
        break;
      case '7':
        animator.current.setDelay(200);
        break;
      default:
        throw new Error('Giá trị của ô input không nằm trong giới hạn đã cài đặt');
    }
    setTimeDelay(e.target.value);
  }

  return (
    <div className="control-bar-container flex justify-between items-center">
      <div className="control-bar__speed flex justify-between items-center w-[140px]">
        <input
          type="range"
          min="1"
          max="7"
          value={timeDelay}
          className="input-range"
          style={{
            width: "110px",
            background: "linear-gradient(to right, #ffffff 0%, #ffffff 100%)",
            backgroundSize: "110px 3px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          onInput={(e: any) => handleTimeDelay(e)}
        />
        <p className="control-bar__seed-number">{timeDelay}X</p>
      </div>

      <div className="control-bar__play flex justify-between items-center h-[100%]">
        <FontAwesomeIcon icon={faBackwardStep} className="control-bar__icon"/>
        <FontAwesomeIcon icon={faCaretLeft} className="control-bar__icon" style={{fontSize: '30px'}} />
        { isPlay ? 
          <FontAwesomeIcon icon={faPlay} className="control-bar__icon" style={{fontSize: '25px'}} onClick={() => setIsPlay(!isPlay)} /> : 
          <FontAwesomeIcon icon={faPause} className="control-bar__icon" style={{fontSize: '30px'}} onClick={() => setIsPlay(!isPlay)} />
        }
        
        <FontAwesomeIcon icon={faCaretRight} className="control-bar__icon" style={{fontSize: '30px'}} />
        <FontAwesomeIcon icon={faForwardStep} className="control-bar__icon" />
      </div>
      
      <div className="control-bar__progress flex items-center">
        <input
          type="range"
          min="0"
          max={algorithm.numberOfStep}
          value={range}
          onChange={(e : any) => setRange(e.target.value)}
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
