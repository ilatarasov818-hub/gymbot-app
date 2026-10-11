import { Button } from "@/ui/Button";
import { Notice } from "@/ui/Notice";
import { useLogin } from "@/data/useLogin";
import { InstallCard } from "@/features/install/InstallCard";

export function LoginScreen() {
  const login = useLogin();
  return (
    <div className="flex flex-1 flex-col justify-center gap-4">
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <img src="./icon.svg" alt="" width={88} height={88} className="rounded-[22px]" />
        <h1 className="text-[28px] font-bold leading-tight">Gym</h1>
        <p className="text-body text-hint">Твой тренер: программа, вес на каждый подход и прогресс.</p>
      </div>

      {login.error && (
        <Notice>
          <p className="mb-3">{login.error}</p>
          <Button size="md" variant="secondary" onClick={() => void login.retry()}>Ещё раз</Button>
        </Notice>
      )}

      <Button href={login.link ?? ""} disabled={!login.link}>Войти через Telegram</Button>
      <p className="px-2 text-center text-caption text-hint">
        Откроется чат с ботом — нажми там «Запустить» и вернись сюда. Пароль не нужен.
      </p>

      <InstallCard />
    </div>
  );
}
