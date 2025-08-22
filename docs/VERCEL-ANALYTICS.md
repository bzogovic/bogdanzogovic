How to enable Vercel Web Analytics and Speed Insights

1. Environment variables (optional)

If you host on Vercel and need a custom base path for observability endpoints (for self-hosted endpoints or proxies), set these environment variables in your Vercel project settings:

- `REACT_APP_VERCEL_OBSERVABILITY_BASEPATH` — e.g. `https://observability.example.com` (optional)
- `REACT_APP_VERCEL_ANALYTICS_DSN` — optional analytics DSN
- `REACT_APP_VERCEL_SPEED_DSN` — optional speed insights DSN

When `REACT_APP_VERCEL_OBSERVABILITY_BASEPATH` is not set, the SDK will use the default Vercel endpoints in production.

2. Deploy to Vercel

- Push your branch to the repo linked to Vercel and let Vercel build & deploy.
- In the Vercel dashboard: Project → Settings → Analytics — enable Web Analytics (and Speed Insights if your plan supports it).
- After a production deployment and real traffic, the Vercel Analytics and Speed Insights dashboards will populate (may take a few minutes).

3. Test locally

Build and serve the production build locally to validate the production script injection (this uses the same build artifact Vercel will deploy):

```bash
npm run build
npx serve -s build
```

Open the served site in a browser and check DevTools → Network for `/_vercel/insights` (analytics script) and `/_vercel/speed-insights` (speed script), and check Console for SDK load logs (we log when `window.va` / `window.si` are detected).

4. Notes

- The project currently uses Create React App with React 16. For best compatibility with modern Vercel SDKs consider upgrading to React 18 and removing `--legacy-peer-deps` during installs.
- I imported the SDKs using their prebuilt `dist/react` entry points to work with this project's resolver. If you upgrade tooling you can switch imports to the package subpaths.
- `npm audit` shows a number of vulnerabilities from older dependencies; run `npm audit fix` or consider dependency upgrades for a long-term fix.
