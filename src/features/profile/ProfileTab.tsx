import { useEffect, useState } from "react";
import { Centered, Notice } from "@/ui/Notice";
import { api, type ProfileAction } from "@/data/api";
import { haptic } from "@/platform/web/telegram";
import type { Profile, ProfileResult } from "@/lib/types";
import { EditSheet } from "./EditSheet";
import { ProfileScreen } from "./ProfileScreen";
import { SurveyScreen } from "./SurveyScreen";
import { profileDraft, type Draft, type FieldKey } from "./questions";

export function ProfileTab({ busy, error: saveError, save }: {
  busy: boolean;
  error: string | null;
  save: (action: ProfileAction) => Promise<ProfileResult | null>;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<FieldKey | null>(null);
  const [restart, setRestart] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.profile().then(setProfile, (e: Error) => setError(e.message));
  }, []);

  const run = async (action: ProfileAction) => {
    const result = await save(action);
    if (!result) return false;
    haptic("success");
    setProfile(result.profile);
    // «Сохранил» и так видно по профилю — показываем только отчёт тренера.
    setMessage(result.message.startsWith("✅ Сохранил") ? null : result.message);
    return true;
  };

  if (error) return <Notice>{error}</Notice>;
  if (!profile) return <Centered>Загрузка…</Centered>;

  if (restart) {
    return (
      <SurveyScreen busy={busy} initial={profileDraft(profile)} onCancel={() => setRestart(false)}
        onSubmit={async (answers) => {
          if (await run({ name: "survey", answers })) setRestart(false);
        }} />
    );
  }

  return (
    <>
      <ProfileScreen profile={profile} busy={busy} message={message}
        onCloseMessage={() => setMessage(null)}
        onEdit={setEditing}
        onRebuild={() => void run({ name: "rebuild" })}
        onRestart={() => { setMessage(null); setRestart(true); }} />
      {editing && (
        <EditSheet field={editing} profile={profile} busy={busy} error={saveError} onClose={() => setEditing(null)}
          onSave={async (patch: Draft) => {
            const value = patch[editing];
            const ok = await run({ name: "edit", field: editing, value, equipment: patch.equipment });
            if (ok) setEditing(null);
          }} />
      )}
    </>
  );
}

