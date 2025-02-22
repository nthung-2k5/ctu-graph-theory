import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import store from './lib/context/store.ts'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ConfigProvider theme={{
                token: {
                    colorPrimary: "#1f5ca9",
                    colorInfo: "#1f5ca9"
                },
                components: {
                    Progress: {
                        remainingColor: "white",
                    },
                    Slider: {
                        trackHoverBg: "#00afef",
                        trackBg: "rgb(0, 175, 239, 0.7)",
                        handleActiveColor: "#1f5ca9",
                    }
                }
            }}>
                <App />
            </ConfigProvider>
        </Provider>
    </StrictMode>,
)
