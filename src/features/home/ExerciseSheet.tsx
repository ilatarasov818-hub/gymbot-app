import { Sheet } from "@/ui/Sheet";
import { formatWeight } from "@/lib/format";
import type { PlanExercise } from "@/lib/types";
import { ExercisePicture, HowTo } from "@/features/workout/ExerciseInfoView";

export function ExerciseSheet({ exercise: ex, onClose }: { exercise: PlanExercise; onClose: () => void }) {
  const weight = ex.bodyweight ? "свой вес" : ex.weight ? `в прошлый раз ${formatWeight(ex.weight)}` : "вес подберём на тренировке";
  return (
    <Sheet title={ex.name} onClose={onClose}>
      <div className="max-h-[75vh] overflow-y-auto">
        <p className="text-caption text-hint">{ex.sets} × {ex.repsMin}–{ex.repsMax} · {weight}</p>
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
      </div>
    </Sheet>
  );
}
