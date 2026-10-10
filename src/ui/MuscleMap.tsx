import Model, { type IExerciseData, type Muscle } from "react-body-highlighter";

// Схема тела спереди и сзади: главные мышцы ярко-красные, помощники — бледные.
const BODY = "#c7c7cc";
const COLORS = ["#ffb4a8", "#ff3b30"]; // индекс = частота − 1

export function MuscleMap({ main, help }: { main: string[]; help: string[] }) {
  const data: IExerciseData[] = [
    { name: "main", muscles: main as Muscle[], frequency: 2 },
    { name: "help", muscles: help.filter((m) => !main.includes(m)) as Muscle[], frequency: 1 },
  ];
  return (
    <div className="flex gap-1" aria-hidden>
      {(["anterior", "posterior"] as const).map((type) => (
        <Model key={type} type={type} data={data} bodyColor={BODY} highlightedColors={COLORS}
          style={{ width: "100%" }} svgStyle={{ width: "100%", height: "auto" }} />
      ))}
    </div>
  );
}
