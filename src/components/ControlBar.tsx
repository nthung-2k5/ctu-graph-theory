import { ConfigProvider, Progress, Slider, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from '../lib/context/hooks';
import { setSpeed, start, stop } from '../lib/context/animationSlice';
import { FaBackwardStep, FaDownload, FaForwardStep, FaPause, FaPlay, FaStop } from 'react-icons/fa6';

export default function ControlBar(props: { onDownloadClicked?: () => void }) 
{
    const { animating, speed } = useAppSelector(state => state.animation);
    const dispatch = useAppDispatch();


    return (
        <div className="h-12 px-3 py-5 bg-[#0D47A1] flex justify-between items-center">
            <div className="control-bar__play flex gap-x-3 items-center h-full">
                {animating ?
                    <FaPause onClick={() => dispatch(stop())} className='control-bar-icon' /> :
                    <FaPlay onClick={() => dispatch(start())} className='control-bar-icon' />
                }
                <FaBackwardStep className='control-bar-icon' />
                <FaStop className='control-bar-icon' />
                <FaForwardStep className='control-bar-icon' />
            </div>

            <Progress strokeColor="#00afef" showInfo={false} className='w-56' />

            <div className="flex justify-between items-center w-[140px]">
                <ConfigProvider theme={{
                    components: {
                        Slider: {
                            railBg: "white",
                            railHoverBg: "white",
                        }
                    }
                }}>
                    <Slider min={1} max={7} value={speed} onChange={(value) => dispatch(setSpeed(value))} className='w-full' tooltip={{formatter: (val) => `Tốc độ x${val}`}} />
                </ConfigProvider>
                <p className="text-lg text-white font-semibold ml-2">{speed}X</p>
            </div>

            <Tooltip title="Tải xuống hình ảnh đồ thị" placement="top">
                <FaDownload className="control-bar-icon" onClick={props.onDownloadClicked} />
            </Tooltip>
        </div>
    );
}
