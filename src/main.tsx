import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "@/app/App";
import { getParam } from "@/platform/web/location";
import { initTheme, setTelegramScheme } from "@/platform/web/theme";
import { applyWallpaper } from "@/platform/web/wallpaper";
import { startTelegram } from "@/platform/web/telegram";
import { registerServiceWorker } from "@/platform/web/install";

initTheme(getParam("theme"));
applyWallpaper();
startTelegram(setTelegramScheme);
registerServiceWorker();

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
