import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./kak_zhe_zaebalo_silno_ochen.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "app"
import { ThemeProvider } from "shared/theme";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
);

