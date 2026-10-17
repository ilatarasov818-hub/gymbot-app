export function getParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}
