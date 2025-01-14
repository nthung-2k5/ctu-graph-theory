import { Editor } from "prism-react-editor"
import { BasicSetup } from "prism-react-editor/setups"
import { Segmented } from 'antd'

import "prism-react-editor/prism/languages/c"

import "prism-react-editor/layout.css"
import "prism-react-editor/themes/github-light.css"

// Required by the basic setup
import "prism-react-editor/search.css"

const GraphInput = () => {
    return (
        <div className='flex flex-col'>
            <div className='flex'>
                <Segmented options={['Vô hướng', 'Có hướng']} className='mb-2 w-full' block defaultValue='Vô hướng' />
            </div>

            <Editor value='' style={{ borderWidth: 1, height: '70vh' }} language=''>
                {editor => <BasicSetup editor={editor} />}
            </Editor>
        </div>
    );
};

export default GraphInput;