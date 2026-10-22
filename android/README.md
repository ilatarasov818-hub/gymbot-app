# Android-приложение (RuStore)

Обёртка над приложением (Trusted Web Activity, Bubblewrap): открывает https://gymbot.gymbot-f4ea8ac9.workers.dev на весь экран, без адресной строки. Все функции и обновления берутся с сайта, пересобирать APK нужно только при смене иконки, названия или адреса.

- Пакет: `ru.gymbot.coach`. Менять нельзя — магазин считает это другим приложением.
- Ключ подписи в репозиторий не кладётся. Потеря ключа = нельзя выпускать обновления.
- Полный экран работает, только если воркер отдаёт `/.well-known/assetlinks.json` с отпечатком ключа (см. `worker/index.js`).

Сборка (JDK 17 + Android SDK прописаны в `~/.bubblewrap/config.json`):

```sh
# в twa-manifest.json поднять appVersionCode и appVersionName
BUBBLEWRAP_KEYSTORE_PASSWORD=… BUBBLEWRAP_KEY_PASSWORD=… bubblewrap build --skipPwaValidation
```

Результат: `app-release-signed.apk` (RuStore принимает APK) и `app-release-bundle.aab`.
