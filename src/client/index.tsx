import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/client/index.css";
import App from "./app.tsx";

const root = document.querySelector("#root");

if (root === null) {
    throw new Error("root element not found");
}

createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
