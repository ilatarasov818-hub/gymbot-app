export function getParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

export function applyTheme(theme: string | null) {
  const dark = theme ? theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (dark) document.documentElement.dataset.theme = "dark";
}
