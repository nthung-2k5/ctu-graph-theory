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
import { MutableRefObject, useEffect, useState } from "react";
import { useNode } from "../tabs/NodeContext";
import { ConfigProvider, Slider } from 'antd';

interface ControlBarProps 
{
    animator: MutableRefObject<GraphAnimator>;
}

export default function ControlBar({ animator }: ControlBarProps) 
{
    const [timeDelay, setTimeDelay] = useState(4);
    const [isPlay, setIsPlay] = useState(true);
    const { algorithm, range, setRange } = useNode();

    // console.log(algorithm.currentStep);

    useEffect(() => animator.current.setDelay(420 * 4 / timeDelay), [timeDelay, animator]);

    return (
        <div className="h-12 px-3 py-5 bg-[#0D47A1] flex justify-between items-center">
            <div className="control-bar__speed flex justify-between items-center w-[140px]">
                <ConfigProvider theme={{
                    components: {
                        Slider: {
                            railBg: "white",
                            railHoverBg: "white",
                        }
                    }
                }}>
                    <Slider min={1} max={7} value={timeDelay} onChange={setTimeDelay} className='w-full' tooltip={{formatter: (val) => `Tốc độ x${val}`}} />
                </ConfigProvider>
                <p className="text-lg text-white font-semibold">{timeDelay}X</p>
            </div>

            <div className="control-bar__play flex justify-between items-center h-[100%]">
                <FontAwesomeIcon icon={faBackwardStep} className="control-bar__icon" />
                <FontAwesomeIcon icon={faCaretLeft} className="control-bar__icon" style={{ fontSize: '30px' }} />
                {isPlay ?
                    <FontAwesomeIcon icon={faPlay} className="control-bar__icon" style={{ fontSize: '25px' }} onClick={() => setIsPlay(!isPlay)} /> :
                    <FontAwesomeIcon icon={faPause} className="control-bar__icon" style={{ fontSize: '30px' }} onClick={() => setIsPlay(!isPlay)} />
                }

                <FontAwesomeIcon icon={faCaretRight} className="control-bar__icon" style={{ fontSize: '30px' }} />
                <FontAwesomeIcon icon={faForwardStep} className="control-bar__icon" />
            </div>

            <div className="control-bar__progress flex items-center">
                <input
                    type="range"
                    min="0"
                    max={algorithm.numberOfStep}
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
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
