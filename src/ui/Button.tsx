import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "plain";
const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg",
  secondary: "bg-bg text-accent",
  plain: "bg-transparent text-accent",
};

export function Button({ children, icon, variant = "primary", size = "lg", onClick }: {
  children: ReactNode; icon?: IconName; variant?: Variant; size?: "md" | "lg"; onClick?: () => void;
}) {
  const height = size === "lg" ? "h-14 text-[17px]" : "h-11 text-body";
  return (
    <button type="button" onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-95 ${height} ${VARIANTS[variant]}`}>
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  );
}
