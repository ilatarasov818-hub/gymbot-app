import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "plain" | "danger";
const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg",
  secondary: "bg-bg text-accent",
  plain: "bg-transparent text-accent",
  danger: "bg-bad text-white",
};

// href — ссылка наружу в виде кнопки: так телефон точно откроет её по нажатию.
export function Button({ children, icon, variant = "primary", size = "lg", disabled, onClick, href }: {
  children: ReactNode; icon?: IconName; variant?: Variant; size?: "md" | "lg"; disabled?: boolean; onClick?: () => void;
  href?: string;
}) {
  const height = size === "lg" ? "h-14 text-[17px]" : "h-11 text-body";
  const className = `flex w-full items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-95 disabled:opacity-50 aria-disabled:opacity-50 ${height} ${VARIANTS[variant]}`;
  const content = <>{icon && <Icon name={icon} size={20} />}{children}</>;
  if (href !== undefined) {
    return disabled
      ? <span aria-disabled="true" className={className}>{content}</span>
      : <a href={href} target="_blank" rel="noopener" onClick={onClick} className={className}>{content}</a>;
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  );
}
