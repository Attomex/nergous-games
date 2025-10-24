import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ["babel-plugin-react-compiler"],
            },
        }),
    ],
    resolve: {
        alias: {
            app: "/src/app",
            pages: "/src/pages",
            widgets: "/src/widgets",
            features: "/src/features",
            shared: "/src/shared",
        },
    },
    server: {
        port: 3000, // ранее был 5173
    },
    build: {
        outDir: "build",
        emptyOutDir: true,
    },
});
