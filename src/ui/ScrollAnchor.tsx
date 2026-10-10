import { useEffect, useRef } from "react";

/** Невидимая точка в конце списка: при смене key прокручивает к ней. */
export function ScrollAnchor({ watch }: { watch: unknown }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "end" });
  }, [watch]);
  return <div ref={ref} />;
}
