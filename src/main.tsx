import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./shared/localization/i18n";
import './index.css'
import "./kak_zhe_zaebalo_silno_ochen.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'app';
import { ThemeProvider } from "shared/theme";
import { ConfigProvider } from "antd";
import { Notification } from "shared/ui";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    token: {
                        fontFamily: '"Manrope", "Open Sans", "Roboto"',
                    },
                }}>
                <ThemeProvider>
                    <App />
                    <Notification />
                </ThemeProvider>
            </ConfigProvider>
        </QueryClientProvider>
  </StrictMode>,
)
