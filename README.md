# Lineup Creator

Fußball-Aufstellungen erstellen und teilen.

## Tech-Stack

- Next.js 16 (App Router)
- Supabase (Auth + Datenbank)
- Stripe (Bezahlung — noch nicht aktiv)
- Tailwind CSS
- Vercel (Deployment)

## Auth / Pro-Features

Die App ist **ohne Login nutzbar**. Pro-Features sind noch nicht live.

### Aktueller Status: Coming Soon

`/auth` zeigt derzeit nur eine "Coming Soon"-Seite. Der Sidebar-Button ("Unlock Pro") führt dorthin, aber Login/Register ist deaktiviert.

**Der vollständige Auth-Code ist vorhanden, aber vorübergehend ausgeblendet:**

- `app/actions/auth.ts` — Server Actions: login, register, logout
- `app/auth/signout/route.ts` — SessionGuard (automatischer Logout bei neuem Tab/Browser)
- `components/sidebar/UserButton.tsx` — Logout-Button mit Email-Anzeige
- `proxy.ts` — Middleware-Ersatz, leitet eingeloggte User von /auth weg

### Auth wieder aktivieren (wenn Pro bereit ist)

1. `app/auth/page.tsx` — Coming Soon Seite durch das Login/Register-Formular ersetzen
2. Stripe-Integration bauen
3. Branch mergen + deployen

### Design-Entscheidungen

- Kein Pflicht-Login — App für alle frei nutzbar
- Sessions nie persistent — Browser/Tab schliessen = ausgeloggt
- Email-Bestätigung bei Registrierung aktiv (Supabase Standard)

## Entwicklung

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).
