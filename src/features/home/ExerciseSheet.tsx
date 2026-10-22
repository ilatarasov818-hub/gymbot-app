import { useState } from "react";
import { Sheet } from "@/ui/Sheet";
import { formatWeight } from "@/lib/format";
import type { PlanExercise } from "@/lib/types";
import { ExercisePicture, ExerciseVideos, HowTo } from "@/features/workout/ExerciseInfoView";
import { NoteLine, NoteSheet } from "@/features/workout/ExerciseNote";

export function ExerciseSheet({ exercise: ex, note, busy, onClose, onNote }: {
  exercise: PlanExercise; note?: string | null; busy: boolean;
  onClose: () => void; onNote: (exercise: string, note: string) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return <NoteSheet name={ex.name} note={note} busy={busy} onClose={() => setEditing(false)}
      onSave={async (text) => { if (await onNote(ex.name, text)) setEditing(false); }} />;
  }
  const weight = ex.bodyweight ? "свой вес" : ex.weight ? `в прошлый раз ${formatWeight(ex.weight)}` : "вес подберём на тренировке";
  return (
    <Sheet title={ex.name} onClose={onClose}>
      <div className="max-h-[75vh] overflow-y-auto">
        <p className="text-caption text-hint">{ex.sets} × {ex.repsMin}–{ex.repsMax} · {weight}</p>
        <NoteLine note={note} disabled={busy} onEdit={() => setEditing(true)} />
        {ex.info ? (
          <>
            <ExercisePicture info={ex.info} />
            {ex.info.how.length > 0 && (
              <>
                <p className="mb-2 mt-5 text-caption font-semibold uppercase tracking-wide text-hint">Как делать</p>
                <HowTo info={ex.info} />
              </>
            )}
          </>
        ) : (
          <p className="mt-4 text-body">Описания пока нет. Спроси тренера в чате — расскажет, как делать.</p>
        )}
        <div className="mt-5"><ExerciseVideos name={ex.name} /></div>
      </div>
    </Sheet>
  );
}
