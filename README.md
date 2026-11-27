# ContactNexus UI

[![CI](https://github.com/sachin-gupta99/ContactNexus-UI/actions/workflows/ci.yml/badge.svg)](https://github.com/sachin-gupta99/ContactNexus-UI/actions/workflows/ci.yml)

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.2-646cff?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Redux-Toolkit-764abc?style=for-the-badge&logo=redux" alt="Redux Toolkit" />
</div>

<br />

<div align="center">
  <h3>Modern contact manager — live demo at <a href="https://contactnexus.vercel.app">contactnexus.vercel.app</a></h3>
  <p>React + Vite frontend for ContactNexus. Pairs with <a href="https://github.com/sachin-gupta99/ContactNexus-Service">ContactNexus-Service</a> on Render + Neon.</p>
</div>

---

## Features

- **Dark theme** with cyan→blue gradients and glassmorphism accents.
- **Signup / login** with full profile capture (work, address, socials, bio, avatar).
- **Forgot / reset password** — email-driven flow, single-use tokens, every session revoked on reset.
- **Email verification** — signup sends a confirmation link and lands on a "check your email" screen with a resend button; the link signs you in. Signing in before confirming explains what to do instead of failing silently.
- **Account lockout notice** — after 5 wrong passwords the form explains the 15-minute pause and links to password reset.
- **Signed-in devices** — Settings lists every device ("Chrome on Windows · signed in 3 days ago · active 2 hours ago"), marks this one, and signs any of them out.
- **Server-side contact search + pagination** — debounced search box, request-id race guard, page controls (12 per page by default).
- **Contact CRUD + favourites** — add / edit / delete from modals, star contacts (optimistic toggle) and filter to favourites (`/contacts?favorites=1`).
- **Import contacts** from a `.vcf` (Android 2.1 with quoted-printable, iOS / Google / Outlook 3.0+) or `.csv` (Google, Outlook or plain name/email columns). Parsed in the browser with a preview; rows without a valid email are listed and skipped, duplicates are skipped by the server.
- **Tags (groups)** — add tags in the contact form (suggestions from existing ones), filter with chips, export just one tag as `.vcf` (`CATEGORIES`), delete a tag everywhere. Imports read vCard `CATEGORIES` and Google `Labels` / `Group Membership`.
- **Contact photos** — upload a photo per contact (private S3, presigned URLs) or keep using an image link; remove it any time.
- **Sorting** — name A–Z / Z–A, recently added, or favourites first; kept in the URL (`?sort=`).
- **Duplicate detection and merge** — a banner flags contacts sharing an email or phone number; merge a group by picking each field's value (tags, notes and timelines are combined, you choose the photo), or edit/delete the extras.
- **Notes and timeline** — click a contact's name for its detail view: notes, birthday and a timeline of calls, meetings, emails and messages. Cards show "contacted 3 days ago"; sort by "Recently contacted".
- **Birthdays** — day, month and optional year on each contact; a badge on cards in the week before, an "Upcoming birthdays" list on Home, and a reminder email the day before (toggle in Settings).
- **Bulk actions** — "Select" mode with a bar to favourite, tag, untag, export or delete many contacts at once (selection survives paging).
- **Shareable card** — Settings creates a public link and QR code for your own card with the fields you choose; `/c/:token` shows it with a "Save contact" vCard button. Rotate or turn it off any time.
- **Typo-tolerant search** — "rvi" finds Ravi (pg_trgm on the server).
- **vCard sharing** — share any contact through the native share sheet (falls back to a `.vcf` download), share your own card from the profile menu, or export every contact as one `.vcf`.
- **Live dashboard** — home and profile show real totals, favourites, contacts added this week, and the five most recent contacts.
- **Account settings** — change password (signs out other devices), sign out everywhere, delete account (password-confirmed).
- **Privacy / Terms pages** and a real 404 inside the app shell.
- **Avatar upload** with live preview — stored in a private S3 bucket and displayed through presigned URLs returned by the API.
- **Secure session flow** — short-lived access JWT + HttpOnly refresh cookie, transparent refresh on 401.
- **Loud 429 handling** — the login toast surfaces the server's rate-limit message instead of swallowing it as "Invalid credentials".

## Auth model (quick tour)

The UI never writes to `localStorage` for auth state. Instead:

- The **access token** lives only in memory (`src/util/tokenStore.js`). It expires in 15 minutes.
- The **refresh token** lives in an HttpOnly cookie set by the server. JavaScript can't read it.
- When any API call returns `401`, the axios response interceptor (`src/api/axiosInstance.js`) silently hits `/api/v1/auth/refresh`, gets a new access token, and retries the original request. A single-flight guard coalesces parallel 401s so only one `/refresh` ever fires at a time.
- On page reload, `RootLayout` calls `/refresh` once at boot to swap the refresh cookie for a fresh access token and rehydrate the current user.
- Signing out (menu, "sign out everywhere", account deletion) goes through `util/session.js`, which also clears the TanStack Query cache. Cache keys include the user id, so one account's cached contacts can never be shown to another.
- Password reset links land on `/auth?mode=reset&token=…`; a successful reset revokes every refresh-token family on the server, so all other open tabs 401 on their next request.

See [ContactNexus-Service's refresh-token design](https://github.com/sachin-gupta99/ContactNexus-Service#authentication) for the server side.

## Routes

| Path | Component | Protected? |
| --- | --- | --- |
| `/home` | `pages/Home.jsx` | public |
| `/auth?mode=signin` | `components/SignInForm.jsx` | public |
| `/auth?mode=signup` | `components/SimpleSignUpForm.jsx` | public |
| `/auth?mode=forgot` | `components/ForgotPasswordForm.jsx` | public |
| `/auth?mode=reset&token=…` | `components/ResetPasswordForm.jsx` | public |
| `/auth?mode=verify&token=…` | `components/VerifyEmail.jsx` | public |
| `/auth?mode=check-email&email=…` | `components/CheckEmail.jsx` | public |
| `/contacts` | `pages/Contacts.jsx` (`?favorites=1`, `?tag=`, `?sort=name-desc\|recent\|favourites`, `?new=1` opens the add form) | ✅ |
| `/profile` | `pages/Profile.jsx` | ✅ |
| `/settings` | `pages/Settings.jsx` | ✅ |
| `/privacy`, `/terms` | `pages/Legal.jsx` | public |
| `/c/:token` | `pages/PublicCard.jsx` | public (the token is the permission) |
| `*` | `pages/NotFound.jsx` | public |

## Quick start

```bash
git clone https://github.com/sachin-gupta99/ContactNexus-UI.git
cd ContactNexus-UI
npm install
npm start      # vite dev server on http://localhost:3000
```

The dev server proxies `/api/*` to `http://localhost:8080` (see `vite.config.js`), so a locally running [ContactNexus-Service](https://github.com/sachin-gupta99/ContactNexus-Service) just works with no env vars.

Node 20+ recommended.

### Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Vite dev server, port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint (`--max-warnings 0`) |
| `npm test` | Vitest unit tests (`src/**/*.test.js`) |

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs `npm install`, lint, test and build on Node 22 for every pull request and push to `main`.

## Tech stack

- **React 18** + **Vite 5** + **React Router 6**
- **TanStack Query v5** for server state: contact lists, stats, and every write (optimistic favourite toggle with rollback; writes invalidate lists + stats so all pages stay in sync)
- **Redux Toolkit** for client state: `user` + `toast` slices
- **Tailwind CSS 3** + **flowbite-react** for form primitives
- **Axios** with request/response interceptors for auth
- **react-icons**, **react-spinners**, **prop-types**, **jwt-decode**

## Project structure

```
src/
  App.jsx                       # RouterProvider + toasts
  router.jsx                    # route table (createBrowserRouter)
  main.jsx                      # ReactDOM + Redux Provider
  api/
    axiosInstance.js            # bearer header + single-flight 401 refresh
    queryClient.js              # TanStack Query defaults (30s staleTime, no 4xx retries)
    authApi.js                  # signup / login / refresh / logout / me
                                # + forgot / reset / change password, logout-all
    userApi.js                  # profile update, avatar upload, delete account
    contactApi.js               # list (q, favorite, page, size, sort), stats, get,
                                # create, update, favourite toggle, delete, import
  util/
    tokenStore.js               # in-memory access token (no localStorage)
    session.js                  # endSession(): token + redux user + query cache
    importContacts.js           # .vcf / .csv parser + validation (tested)
    vcard.js                    # vCard 3.0 builder + Web Share / download
    exportContacts.js           # pages through every contact into one .vcf
    useSlowHint.js              # "server is waking up" hint for slow requests
  hooks/
    useContacts.js              # query keys, list/stats queries, mutations (tested)
  store/
    index.js                    # root reducer
    user.js                     # { user, authReady }
    toast.js
  layouts/
    RootLayout.jsx              # boot /refresh + layout shell
  pages/
    Auth.jsx                    # routes to SignIn / SignUp / Forgot / Reset form
    Home.jsx                    # marketing page, or live dashboard when signed in
    Contacts.jsx                # paginated, searchable, favourites filter
    Profile.jsx, Settings.jsx
    Legal.jsx, NotFound.jsx
  components/
    SignInForm.jsx, SimpleSignUpForm.jsx
    ForgotPasswordForm.jsx, ResetPasswordForm.jsx
    ProtectedRoute.jsx, Navbar.jsx, Dropdown.jsx, FooterLayout.jsx
    ContactCard.jsx, ContactFormModal.jsx, ImportContactsModal.jsx, ConfirmModal.jsx
    EditProfileModal.jsx, ImagePicker.jsx, ToastContainer.jsx
```

## Deployment

Production lives on **Vercel**, auto-deployed from `main` with no workflow file — `vercel.json` handles the build and reverse-proxies `/api/*` to the Render backend so the browser sees one origin (keeps the refresh cookie on `SameSite=Lax` and skips a CORS preflight per call). A catch-all route to `/index.html` handles SPA deep links.

`vercel.json` uses `routes` (not `rewrites`) because only routes support [`transforms`](https://vercel.com/docs/routing/rewrites): the `/api` route adds an `x-origin-secret` header from the **`ORIGIN_SECRET`** project environment variable. The backend uses it to tell requests that came through Vercel (whose `X-Forwarded-For` Vercel overwrites, so it can be trusted) from direct calls to Render (whose `X-Forwarded-For` can be forged). Set `ORIGIN_SECRET` in Vercel before setting the same value as `PROXY_SECRET` on Render.

Full walkthrough: [DEPLOY.md](DEPLOY.md).

| Environment | URL |
| --- | --- |
| Production UI | [contactnexus.vercel.app](https://contactnexus.vercel.app) |
| Production API | [contactnexus-service.onrender.com](https://contactnexus-service.onrender.com) |

## Roadmap

- [x] JWT + refresh-token auth with transparent refresh on 401
- [x] Full-profile signup + login
- [x] Forgot / reset password UI
- [x] Contacts page backed by the real paginated API with debounced search
- [x] Add / edit / delete contact UI
- [x] Favourites, vCard share and export
- [x] Settings: change password, sign out everywhere, delete account
- [x] Import from .vcf / .csv
- [x] CI: lint, test, build on every PR
- [x] TanStack Query for server state
- [x] Contact tags / groups, photos, sorting, duplicate detection
- [x] Notes, timeline, birthdays + reminders, merge, bulk actions, shareable card, fuzzy search
- [x] "Signed-in devices" screen with per-device sign-out
- [x] Email verification and account lockout
- [ ] Migration to TypeScript
- [ ] Swap flowbite-react for shadcn/ui

## License

MIT — see [LICENSE](LICENSE).
