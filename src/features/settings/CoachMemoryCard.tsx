import { Card, Row } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { useFacts } from "@/data/useFacts";

// Что тренер запомнил из разговора. Удалить можно любой пункт.
export function CoachMemoryCard() {
  const { facts, error, remove } = useFacts();
  if (facts === null) return null;

  return (
    <Card title="Что помнит тренер">
      {facts.length === 0 ? (
        <p className="text-body text-hint">Пока ничего. Скажи тренеру в чате «запомни …» — например, про травму или график.</p>
      ) : (
        <>
          {facts.map((fact) => (
            <Row key={fact.id} left={<span className="whitespace-normal">{fact.text}</span>}
              right={(
                <button type="button" aria-label={`Забыть: ${fact.text}`} onClick={() => void remove(fact.id)}
                  className="-mr-1 p-1 text-hint">
                  <Icon name="trash" size={20} />
                </button>
              )} />
          ))}
          <p className="mt-3 text-caption text-hint">Тренер учитывает это в советах. Программу меняют только «Ограничения» в профиле.</p>
        </>
      )}
      {error && <p className="mt-2 text-caption text-bad">{error}</p>}
    </Card>
  );
}
