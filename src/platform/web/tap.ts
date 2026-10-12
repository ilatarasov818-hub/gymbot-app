// Отклик телом телефона на iPhone: Safari не умеет vibrate(), но щёлкает,
// когда переключают системный переключатель (iOS 18). Нажимаем невидимый.
let label: HTMLLabelElement | null = null;

function ensure(): HTMLLabelElement {
  if (label) return label;
  label = document.createElement("label");
  label.setAttribute("aria-hidden", "true");
  label.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.tabIndex = -1;
  label.appendChild(input);
  document.body.appendChild(label);
  return label;
}

export function tap(times = 1) {
  ensure().click();
  for (let i = 1; i < times; i++) setTimeout(() => ensure().click(), i * 90);
}
