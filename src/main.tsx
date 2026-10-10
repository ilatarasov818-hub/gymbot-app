import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "@/app/App";
import { applyTheme, getParam } from "@/platform/web/location";
import { startTelegram } from "@/platform/web/telegram";

applyTheme(getParam("theme"));
startTelegram((scheme) => applyTheme(getParam("theme") ?? scheme));

const root = createRoot(document.getElementById("root")!);
const mock = getParam("mock");
if (import.meta.env.DEV && mock) {
  void import("@/dev/Mockups").then(({ Mockups }) => root.render(<Mockups name={mock} />));
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
