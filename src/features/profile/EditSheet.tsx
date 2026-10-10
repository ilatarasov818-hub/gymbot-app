import { useState } from "react";
import { Button } from "@/ui/Button";
import { Notice } from "@/ui/Notice";
import { Sheet } from "@/ui/Sheet";
import type { Profile } from "@/lib/types";
import { QUESTIONS, profileDraft, type Draft, type FieldKey } from "./questions";

export function EditSheet({ field, profile, busy, error, onSave, onClose }: {
  field: FieldKey;
  profile: Profile;
  busy: boolean;
  error?: string | null;
  onSave: (patch: Draft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => profileDraft(profile));
  const question = QUESTIONS[field];
  const save = (d: Draft) => onSave(field === "place" ? { place: d.place, equipment: d.equipment } : { [field]: d[field] });

  return (
    <Sheet title={question.title} onClose={onClose}>
      {question.note && <p className="-mt-2 mb-4 text-caption text-hint">{question.note}</p>}
      {question.render({
        draft,
        set: (patch) => setDraft({ ...draft, ...patch }),
        pick: (patch) => save({ ...draft, ...patch }),
      })}
      {error && <div className="mt-4"><Notice>{error}</Notice></div>}
      {question.confirm && (
        <div className="mt-4">
          <Button disabled={busy || !question.ready(draft)} onClick={() => save(draft)}>
            {busy && field === "limitations" ? "Подбираю замены…" : "Сохранить"}
          </Button>
        </div>
      )}
    </Sheet>
  );
}
