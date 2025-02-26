import { ConfigProvider, Progress, Slider, Tooltip } from 'antd';
import { FaBackwardStep, FaDownload, FaForwardStep, FaPause, FaPlay, FaStop } from 'react-icons/fa6';
import { useGraphTheory } from '../lib/context/GraphTheoryContext';

const IconButton = (props: { icon: JSX.Element, disabled?: boolean, onClick?: () => void }) =>
{
    const { predicateError } = useGraphTheory();

    return (
        <button disabled={predicateError !== null || props.disabled} onClick={props.onClick} className='control-bar-icon'>
            {props.icon}
        </button>
    );
}

export default function ControlBar(props: { onDownloadClicked?: () => void }) 
{
    const { playing, paused, speed, setSpeed, play, pause, stop, rewind, fastForward } = useGraphTheory();

    return (
        <div className='flex flex-col px-3 bg-[#0D47A1]'>
            <div className='h-6 flex items-center'>
                <Progress strokeColor="#00afef" showInfo={false} className='w-full' />
            </div>
            <div className="h-12 py-5 flex justify-between items-center">
                <div className="control-bar__play flex items-center justify-around">
                    {playing && !paused ?
                        <IconButton onClick={pause} icon={<FaPause />}/> :
                        <IconButton onClick={play} icon={<FaPlay />}/>
                    }
                    <div className='ml-4 flex flex-grow gap-x-3'>
                        <IconButton disabled={playing} onClick={stop} icon={<FaStop />}/>
                        <IconButton disabled={playing} onClick={rewind} icon={<FaBackwardStep />}/>
                        <IconButton disabled={playing} onClick={fastForward} icon={<FaForwardStep />}/>
                    </div>
                </div>

                <div className="flex justify-between items-center flex-grow mx-4">
                    <ConfigProvider theme={{
                        components: {
                            Slider: {
                                railBg: "white",
                                railHoverBg: "white",
                            }
                        }
                    }}>
                        <Slider min={1} max={7} value={speed} onChange={(value) => setSpeed(value)} className='w-full' tooltip={{formatter: (val) => `Tốc độ x${val}`}} />
                    </ConfigProvider>
                    <p className="text-lg text-white font-semibold ml-2 hidden lg:block">{speed}X</p>
                </div>

                <Tooltip title="Tải xuống hình ảnh đồ thị" placement="top">
                    <FaDownload className="control-bar-icon" onClick={props.onDownloadClicked} />
                </Tooltip>
            </div>
        </div>
        
    );
}
