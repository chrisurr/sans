<div align="center">

<img src="assets/logo.png" alt="sans" width="200" />

### Sicher feiern – und im Trubel aufeinander aufpassen.

Eine Safety-Buddy-App für Partys & Events: Melde dich an, lege Partys an und
beauftrage andere Gäste, auf jemanden aufzupassen, der/die alleine unterwegs ist.

![Expo SDK 56](https://img.shields.io/badge/Expo-SDK%2056-000020?style=flat&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.85-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-typed-3178C6?style=flat&logo=typescript&logoColor=white)
![React Navigation](https://img.shields.io/badge/React%20Navigation-7-6B52AE?style=flat&logo=react&logoColor=white)
![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android-7C5CFC?style=flat&logo=android&logoColor=white)
![Status](https://img.shields.io/badge/Status-Prototyp-FF5CA8?style=flat)
![License](https://img.shields.io/badge/License-MIT-3DDC97?style=flat)

</div>

---

> [!NOTE]
> **Status: klickbarer Prototyp.** Alle Daten liegen nur lokal auf dem Gerät
> (Mock-Daten + React Context) und werden beim Neustart zurückgesetzt – noch
> kein echtes Backend.

## ✨ Features

- 🔐 **Anmeldung & Registrierung** – Mock-Auth, Session bleibt via AsyncStorage erhalten
- 🎉 **Events / Partys** – ansehen, anlegen und zu-/absagen
- 🛡️ **Aufpass-Aufträge** – wähle *„wer ist alleine?"* + *„wer passt auf?"* und sende den Auftrag
- 🔔 **Meine Aufträge** – Anfragen annehmen/ablehnen, aktive Aufträge abschließen, sehen wer auf dich aufpasst
- 👤 **Profil** – Statistiken & Logout
- 🌙 **Dunkles Party-Theme** in Lila → Pink

## 🧠 Die Idee

Im Zentrum steht das **Buddy-System**. Ein *Auftrag* (`WatchAssignment`)
verknüpft drei Dinge:

| Rolle | Bedeutung |
|------|-----------|
| **Guardian** 🛡️ | der/die beauftragte Aufpasser:in |
| **Ward** 💜 | die Person, die alleine ist und auf die aufgepasst wird |
| **Event** 🎉 | die Party, bei der das passiert |

Ein Auftrag durchläuft die Status: `angefragt → angenommen / abgelehnt → abgeschlossen`.

## 🚀 Schnellstart

**Voraussetzungen:** [Node.js](https://nodejs.org/) und die **Expo Go**-App auf dem
Handy ([iOS](https://apps.apple.com/app/expo-go/id982107779) /
[Android](https://play.google.com/store/apps/details?id=host.exp.exponent)).

```bash
# Abhängigkeiten installieren
npm install

# Dev-Server starten
npm start
```

Dann den angezeigten **QR-Code** scannen:

- **Android:** direkt in der Expo-Go-App
- **iPhone:** mit der Kamera-App → öffnet Expo Go

> Alternativ im Terminal `a` (Android-Emulator) oder `i` (iOS-Simulator, nur macOS) drücken.

### 🔑 Demo-Login

Auf dem Login-Screen einfach auf einen Demo-Account tippen (z. B. **benapp 🦊** –
hat direkt eine offene Aufpass-Anfrage). Passwort für alle Demo-Accounts:

```
demo1234
```

## 🛠️ Tech-Stack

- **[Expo](https://expo.dev/) SDK 56** + **React Native 0.85** + **React 19**
- **TypeScript**
- **[React Navigation 7](https://reactnavigation.org/)** (Bottom-Tabs + Native-Stack)
- **Expo Linear Gradient** für das Theme
- **AsyncStorage** für die Session

## 📁 Projektstruktur

```
App.tsx                      # Einstieg: Provider + Navigation
src/
├─ theme.ts                  # Farben, Abstände, Gradients
├─ types.ts                  # Domänen-Modelle (User, Event, WatchAssignment)
├─ data/mockData.ts          # Seed-Daten (Demo-User, Events, Aufträge)
├─ context/AppContext.tsx    # Globaler State + alle Aktionen
├─ components/               # Wiederverwendbare UI (Button, Card, Avatar, …)
├─ screens/                  # Login, Events, Detail, Aufträge, Profil, …
├─ navigation/               # Auth-Stack, Tabs, Root-Navigator
└─ utils/                    # ID- & Datums-Helfer
```

## 🧪 Entwicklung

```bash
npx tsc --noEmit             # Typecheck (muss sauber sein)
npx expo export --platform android --output-dir .expo-check   # Bundle-Smoke-Test
```

## 🗺️ Roadmap

- [ ] Echtes Backend (z. B. Supabase / Firebase) für Auth & geteilte Daten
- [ ] Push-Notifications, wenn ein Aufpass-Auftrag eintrifft
- [ ] Standort-Teilen & „Ich bin sicher zuhause"-Button
- [ ] Foto-Avatare statt Emojis

## 📄 Lizenz

[MIT](LICENSE) © 2026 benapp

---

<div align="center">
<sub>Gebaut mit 💜 und Expo · Passt aufeinander auf! 🛡️</sub>
</div>
