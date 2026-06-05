@AGENTS.md

# sa'ns — Projektnotizen für Claude

Safety-Buddy-App für Partys (Expo / React Native + TypeScript). Klickbarer
Prototyp mit lokalen Mock-Daten – **kein Backend**. Alles im State über
`src/context/AppContext.tsx`.

## Architektur
- **State:** ein einziger React Context (`AppContext`) hält `users`, `events`,
  `assignments`, `currentUser` und alle Aktionen. Seed-Daten aus
  `src/data/mockData.ts`. Nur die Session-ID wird via AsyncStorage persistiert.
- **Navigation:** `src/navigation/RootNavigator.tsx` schaltet anhand von
  `currentUser` zwischen `AuthStack` (Login/Register) und `AppStack` (Tabs +
  Detail-/Modal-Screens). Bottom-Tabs: Events, Aufträge, Profil.
- **Domäne:** `WatchAssignment` = Auftrag, bei dem ein `guardian` (Aufpasser)
  auf einen `ward` (alleinstehende Person) bei einem `event` aufpasst. Status:
  pending → accepted/declined → completed.
- **UI:** Design-Tokens in `src/theme.ts` (dunkles Lila/Pink-Theme).
  Wiederverwendbare Komponenten in `src/components/` (Barrel in `index.ts`).

## Konventionen
- UI-Texte & Kommentare auf Deutsch.
- Neue Bildschirme: `src/screens/`, in den passenden Navigator eintragen und
  Param-Typen in `src/navigation/types.ts` ergänzen.
- Vor dem Abschluss prüfen: `npx tsc --noEmit` muss sauber sein.

## Befehle
- `npm start` — Dev-Server / Expo Go
- `npx tsc --noEmit` — Typecheck
- `npx expo export --platform android --output-dir .expo-check` — Bundle-Smoke-Test
  (Ordner danach löschen)
