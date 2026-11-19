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
- **Contact CRUD** — list, search, paginate, view, edit, delete.
- **Avatar upload** with live preview.
- **Secure session flow** — short-lived access JWT + HttpOnly refresh cookie, transparent refresh on 401.

## Auth model (quick tour)

The UI never writes to `localStorage` for auth state. Instead:

- The **access token** lives only in memory (`src/util/tokenStore.js`). It expires in 15 minutes.
- The **refresh token** lives in an HttpOnly cookie set by the server. JavaScript can't read it.
- When any API call returns `401`, the axios response interceptor (`src/api/axiosInstance.js`) silently hits `/api/v1/auth/refresh`, gets a new access token, and retries the original request. A single-flight guard coalesces parallel 401s so only one `/refresh` ever fires at a time.
- On page reload, `RootLayout` calls `/refresh` once at boot to swap the refresh cookie for a fresh access token and rehydrate the current user.

See [ContactNexus-Service's refresh-token design](https://github.com/sachin-gupta99/ContactNexus-Service#authentication) for the server side.

## Quick start

```bash
git clone https://github.com/sachin-gupta99/ContactNexus-UI.git
cd ContactNexus-UI
npm install
npm start      # vite dev server on http://localhost:3000
```

The dev server proxies `/api/*` and `/uploads/*` to `http://localhost:8080` (see `vite.config.js`), so a locally running [ContactNexus-Service](https://github.com/sachin-gupta99/ContactNexus-Service) just works with no env vars.

### Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Vite dev server, port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint (`--max-warnings 0`) |

## Tech stack

- **React 18** + **Vite 5** + **React Router 6**
- **Redux Toolkit** for `user` + `toast` + `contact` slices
- **Tailwind CSS 3** + **flowbite-react** for form primitives
- **Axios** with request/response interceptors for auth
- **react-icons**, **react-spinners**, **prop-types**, **jwt-decode**

## Project structure

```
src/
  App.jsx                   # createBrowserRouter root
  main.jsx                  # ReactDOM + Redux Provider
  api/
    axiosInstance.js        # bearer header + single-flight 401 refresh
    authApi.js              # /auth/signup, /login, /refresh, /logout, /me
    userApi.js              # avatar upload
    contactApi.js           # contact CRUD
  util/
    tokenStore.js           # in-memory access token (no localStorage)
  store/
    index.js                # root reducer
    user.js                 # { user, authReady }
    contact.js, toast.js
  layouts/
    RootLayout.jsx          # boot /refresh + layout shell
  pages/
    Auth.jsx, Home.jsx, Contacts.jsx, Profile.jsx, Settings.jsx
  components/
    SignInForm.jsx, SimpleSignUpForm.jsx
    ProtectedRoute.jsx, Navbar.jsx, Dropdown.jsx
    ContactCard.jsx, ImagePicker.jsx, ToastContainer.jsx
    ...
```

## Deployment

Production lives on **Vercel**, auto-deployed from `main` with no workflow file — `vercel.json` handles the build and reverse-proxies `/api/*` + `/uploads/*` to the Render backend so the browser sees one origin (keeps the refresh cookie on `SameSite=Lax` and skips a CORS preflight per call).

Full walkthrough: [DEPLOY.md](DEPLOY.md).

| Environment | URL |
| --- | --- |
| Production UI | [contactnexus.vercel.app](https://contactnexus.vercel.app) |
| Production API | [contactnexus-service.onrender.com](https://contactnexus-service.onrender.com) |

## License

MIT — see [LICENSE](LICENSE).
