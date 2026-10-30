import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    build: {
        emptyOutDir: true,
        outDir: "../../dist",
    },
    plugins: [react(), tailwindcss()],
    resolve: {
        tsconfigPaths: true,
    },
    root: "src/client",
    server: {
        proxy: { "/api": "http://localhost:3000" },
    },
});
