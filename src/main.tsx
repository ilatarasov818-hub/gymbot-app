import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "@/app/App";
import { applyTheme, getParam } from "@/platform/web/location";
import { startTelegram } from "@/platform/web/telegram";

applyTheme(getParam("theme"));
startTelegram((scheme) => applyTheme(getParam("theme") ?? scheme));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
