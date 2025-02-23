import CTULogo from '/public/CTU.svg?react';
import './app.css'
import { Col, Row } from 'antd';
import GraphInputTab from './tabs/GraphInputTab';
import AlgorithmsTab from './tabs/AlgorithmsTab';
import GraphDisplayTab from './tabs/GraphDisplayTab';
import { GraphTheoryProvider } from './lib/context/GraphTheoryProvider';

export default function App() 
{

    return (
        <GraphTheoryProvider>
            <div className='flex flex-col h-screen pb-4'>
                <div className='p-2 border-b flex items-end h-[10vh]'>
                    <CTULogo className='h-[7vh] my-auto w-auto' />
                </div>
                <Row className='max-h-[calc(90vh-1rem)]  h-[calc(90vh-1rem)] mx-4'>
                    <Col span={5} className='flex h-full'>
                        <GraphInputTab/>
                    </Col>
                    <Col span={12} className='flex h-full px-4'>
                        <GraphDisplayTab/>
                    </Col>
                    <Col span={7} className='flex h-full'>
                        <AlgorithmsTab/>
                    </Col>
                </Row>
            </div>
        </GraphTheoryProvider>
    )
}
