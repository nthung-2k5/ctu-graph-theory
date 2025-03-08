import { ConfigProvider, Progress, Slider, Tooltip } from 'antd';
import { FaArrowRotateLeft, FaBackwardStep, FaDownload, FaForwardStep, FaPause, FaPlay } from 'react-icons/fa6';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';
import { useAnimation } from '../lib/context/AnimationContext';

const IconButton = (props: { icon: JSX.Element, disabled?: boolean, onClick?: () => void }) =>
{
    const { predicateError } = useGraphTheory();

    return (
        <button disabled={predicateError !== null || props.disabled} onClick={props.onClick} className='control-bar-icon'>
            {props.icon}
        </button>
    );
}

export default function ControlBar(props: { onDownloadClicked?: () => void, onRefreshClicked?: () => void }) 
{
    const anim = useAnimation();

    return (
        <div className='flex flex-col px-3 bg-[#0D47A1]'>
            <div className='h-6 flex items-center'>
                <Progress strokeColor="#00afef" percent={anim.cursor / anim.steps * 100} showInfo={false}  className='w-full' />
            </div>
            <div className="h-12 py-5 flex justify-between items-center gap-x-4">
                <div className="control-bar__play flex items-center justify-around">
                    {anim.playing ?
                        <IconButton onClick={anim.pause} icon={<FaPause />}/> :
                        <IconButton onClick={anim.resume} icon={<FaPlay />}/>
                    }
                    <div className='ml-4 flex flex-grow gap-x-3'>
                        <IconButton disabled={anim.playing} onClick={anim.rewind} icon={<FaBackwardStep />}/>
                        <IconButton disabled={anim.playing} onClick={anim.forward} icon={<FaForwardStep />}/>
                    </div>
                </div>

                <div className="flex justify-between items-center flex-grow">
                    <ConfigProvider theme={{
                        components: {
                            Slider: {
                                railBg: "white",
                                railHoverBg: "white",
                            }
                        }
                    }}>
                        <Slider min={0} max={4} step={.5} value={anim.speed} onChange={(value) => anim.setSpeed(value)} className='w-full' tooltip={{formatter: (val) => `Tốc độ x${(val ?? 0.5) * 2}`}} />
                    </ConfigProvider>
                    <p className="text-lg text-white font-semibold ml-2 hidden lg:block">{anim.speed * 2}X</p>
                </div>

                <Tooltip title="Đặt lại đồ thị" placement="top">
                    <FaArrowRotateLeft className="control-bar-icon" onClick={props.onRefreshClicked} />
                </Tooltip>

                <Tooltip title="Tải xuống hình ảnh đồ thị" placement="top">
                    <FaDownload className="control-bar-icon" onClick={props.onDownloadClicked} />
                </Tooltip>
            </div>
        </div>
        
    );
}
