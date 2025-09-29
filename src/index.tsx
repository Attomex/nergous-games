import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./kak_zhe_zaebalo_silno_ochen.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "app";
import { ThemeProvider } from "shared/theme";
import { ConfigProvider } from "antd";
import { Notification } from "shared/ui";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
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
    </React.StrictMode>
);
