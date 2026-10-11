import { useEffect, useState } from "react";
import { Centered, Notice } from "@/ui/Notice";
import { api, type ProfileAction } from "@/data/api";
import { haptic } from "@/platform/web/telegram";
import { accentPref, setAccentPref, setThemePref, themePref } from "@/platform/web/theme";
import { DEFAULT_ACCENT } from "@/lib/accents";
import { pickImage } from "@/platform/web/image";
import type { Me, Profile, ProfileResult } from "@/lib/types";
import { DeleteSheet, FeedbackSheet } from "./AccountSheets";
import { EditSheet } from "./EditSheet";
import { InstallCard } from "@/features/install/InstallCard";
import { AvatarSheet, MeSheet } from "@/features/settings/MeSheets";
import { SettingsScreen, type MeField } from "@/features/settings/SettingsScreen";
import { ProfileScreen } from "./ProfileScreen";
import { SurveyScreen } from "./SurveyScreen";
import { profileDraft, type Draft, type FieldKey } from "./questions";

type Account = "feedback" | "delete";

export function ProfileTab({ busy, error: saveError, save, installUrl, onLogout, onDeleted, onMeChange }: {
  busy: boolean;
  error: string | null;
  save: (action: ProfileAction) => Promise<ProfileResult | null>;
  installUrl: string | null;
  onLogout?: () => void;
  onDeleted: () => void;
  onMeChange: () => void;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<FieldKey | null>(null);
  const [restart, setRestart] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [accountBusy, setAccountBusy] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [theme, setTheme] = useState(themePref);
  const [accent, setAccent] = useState(() => accentPref() ?? DEFAULT_ACCENT);
  const [me, setMe] = useState<Me | null>(null);
  const [settings, setSettings] = useState(false);
  const [meSheet, setMeSheet] = useState<MeField | "avatar" | null>(null);
  const [meBusy, setMeBusy] = useState(false);
  const [meError, setMeError] = useState<string | null>(null);

  useEffect(() => {
    api.profile().then(setProfile, (e: Error) => setError(e.message));
    api.me().then(setMe, (e: Error) => setError(e.message));
  }, []);

  const saveMe = async (patch: Parameters<typeof api.saveMe>[0]) => {
    setMeBusy(true);
    setMeError(null);
    try {
      setMe(await api.saveMe(patch));
      // Имя на главной и единицы веса берутся из общего состояния.
      if ("name" in patch || "units" in patch) onMeChange();
      haptic("success");
      setMeSheet(null);
    } catch (e) {
      setMeError((e as Error).message);
    } finally {
      setMeBusy(false);
    }
  };

  const pickAvatar = async () => {
    const image = await pickImage();
    if (image) await saveMe({ avatar: image });
  };

  const run = async (action: ProfileAction) => {
    const result = await save(action);
    if (!result) return false;
    haptic("success");
    setProfile(result.profile);
    // «Сохранил» и так видно по профилю — показываем только отчёт тренера.
    setMessage(result.message.startsWith("✅ Сохранил") ? null : result.message);
    return true;
  };

  const openAccount = (sheet: Account | null) => { setAccount(sheet); setAccountError(null); };

  const sendFeedback = async (text: string) => {
    setAccountBusy(true);
    try {
      setMessage((await api.feedback(text)).message);
      haptic("success");
      openAccount(null);
    } catch (e) {
      setAccountError((e as Error).message);
    } finally {
      setAccountBusy(false);
    }
  };

  const deleteData = async () => {
    setAccountBusy(true);
    try {
      await api.deleteData();
      haptic("success");
      onDeleted();
    } catch (e) {
      setAccountError((e as Error).message);
      setAccountBusy(false);
    }
  };

  if (error) return <Notice>{error}</Notice>;
  if (!profile || !me) return <Centered>Загрузка…</Centered>;

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
      {settings ? (
        <SettingsScreen me={me}
          theme={theme} onTheme={(t) => { setThemePref(t); setTheme(t); haptic("light"); }}
          accent={accent} onAccent={(a) => { setAccentPref(a); setAccent(a); haptic("light"); }}
          onBack={() => { setMessage(null); setSettings(false); }}
          message={message} onCloseMessage={() => setMessage(null)}
          onAvatar={() => { setMeError(null); setMeSheet("avatar"); }}
          onEdit={(field) => { setMeError(null); setMeSheet(field); }}
          onSex={(sex) => void saveMe({ sex })}
          onUnits={(units) => void saveMe({ units })}
          onFeedback={() => openAccount("feedback")}
          onDelete={() => openAccount("delete")}
          onLogout={onLogout}
          install={<InstallCard installUrl={installUrl} />} />
      ) : (
        <ProfileScreen profile={profile} me={me} busy={busy} message={message}
          onSettings={() => { setMessage(null); setSettings(true); }}
          onCloseMessage={() => setMessage(null)}
          onEdit={setEditing}
          onRebuild={() => void run({ name: "rebuild" })}
          onRestart={() => { setMessage(null); setRestart(true); }} />
      )}
      {meSheet === "avatar" && (
        <AvatarSheet me={me} busy={meBusy} error={meError} onPick={() => void pickAvatar()} onTelegram={() => void saveMe({ avatar: "telegram" })}
          onRemove={() => void saveMe({ avatar: null })} onClose={() => setMeSheet(null)} />
      )}
      {meSheet && meSheet !== "avatar" && (
        <MeSheet field={meSheet} me={me} busy={meBusy} error={meError} onSave={(patch) => void saveMe(patch)}
          onClose={() => setMeSheet(null)} />
      )}
      {account === "feedback" && (
        <FeedbackSheet busy={accountBusy} error={accountError} onSend={(text) => void sendFeedback(text)}
          onClose={() => openAccount(null)} />
      )}
      {account === "delete" && (
        <DeleteSheet busy={accountBusy} error={accountError} onDelete={() => void deleteData()}
          onClose={() => openAccount(null)} />
      )}
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

