# ContactNexus UI

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
- **Server-side contact search + pagination** — debounced search box, request-id race guard, page controls (12 per page by default).
- **Contact CRUD + favourites** — add / edit / delete from modals, star contacts (optimistic toggle) and filter to favourites (`/contacts?favorites=1`).
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
| `/contacts` | `pages/Contacts.jsx` (`?favorites=1` filters, `?new=1` opens the add form) | ✅ |
| `/profile` | `pages/Profile.jsx` | ✅ |
| `/settings` | `pages/Settings.jsx` | ✅ |
| `/privacy`, `/terms` | `pages/Legal.jsx` | public |
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

## Tech stack

- **React 18** + **Vite 5** + **React Router 6**
- **Redux Toolkit** for `user` + `toast` slices
- **Tailwind CSS 3** + **flowbite-react** for form primitives
- **Axios** with request/response interceptors for auth
- **react-icons**, **react-spinners**, **prop-types**, **jwt-decode**

## Project structure

```
src/
  App.jsx                       # createBrowserRouter root
  main.jsx                      # ReactDOM + Redux Provider
  api/
    axiosInstance.js            # bearer header + single-flight 401 refresh
    authApi.js                  # signup / login / refresh / logout / me
                                # + forgot / reset / change password, logout-all
    userApi.js                  # profile update, avatar upload, delete account
    contactApi.js               # list (q, favorite, page, size, sort), stats, get,
                                # create, update, favourite toggle, delete
  util/
    tokenStore.js               # in-memory access token (no localStorage)
    vcard.js                    # vCard 3.0 builder + Web Share / download
    exportContacts.js           # pages through every contact into one .vcf
    useSlowHint.js              # "server is waking up" hint for slow requests
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
    ContactCard.jsx, ContactFormModal.jsx, ConfirmModal.jsx
    EditProfileModal.jsx, ImagePicker.jsx, ToastContainer.jsx
```

## Deployment

Production lives on **Vercel**, auto-deployed from `main` with no workflow file — `vercel.json` handles the build and reverse-proxies `/api/*` to the Render backend so the browser sees one origin (keeps the refresh cookie on `SameSite=Lax` and skips a CORS preflight per call). A catch-all rewrite to `/index.html` handles SPA deep links.

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
- [ ] Contact tags / groups
- [ ] "Active sessions" screen letting users revoke individual refresh-token families
- [ ] Migration to TypeScript
- [ ] Swap flowbite-react for shadcn/ui
- [ ] React Query for API state (kills the manual `useEffect` + `reqIdRef` patterns)

## License

MIT — see [LICENSE](LICENSE).
