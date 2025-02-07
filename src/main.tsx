import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
        <ConfigProvider theme={{
            token: {
                colorPrimary: "#1f5ca9",
                colorInfo: "#1f5ca9"
            }
        }}>
            <App />
        </ConfigProvider>
    // </StrictMode>,
)
