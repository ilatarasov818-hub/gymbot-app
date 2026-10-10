import { MuscleMap } from "@/ui/MuscleMap";
import type { ExerciseInfo } from "@/lib/types";

export function ExercisePicture({ info }: { info: ExerciseInfo }) {
  return (
    <div className="mt-4">
      {info.image ? (
        <div className="grid grid-cols-2 items-center gap-3">
          <div>
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white">
              <img src={info.image} alt="" className="h-full w-full object-contain" />
            </div>
            {/* drawings are CC BY-SA 4.0 — attribution is required */}
            <p className="mt-1 truncate text-center text-[9px] text-hint">рис.: everkinetic.com · CC BY-SA 4.0</p>
          </div>
          <MuscleMap main={info.main} help={info.help} />
        </div>
      ) : (
        <div className="mx-auto w-2/3"><MuscleMap main={info.main} help={info.help} /></div>
      )}
      <p className="mt-3 text-caption">
        <span className="font-semibold text-bad">Работают:</span> {info.mainText}
        {info.helpText && <><span className="text-hint"> · помогают: </span>{info.helpText}</>}
      </p>
    </div>
  );
}

export function HowTo({ info }: { info: ExerciseInfo }) {
  if (!info.how.length) return null;
  return (
    <ul className="flex flex-col gap-1.5">
      {info.how.map((line) => (
        <li key={line} className="flex gap-2 text-caption"><span className="text-hint">•</span>{line}</li>
      ))}
    </ul>
  );
}
