# Portfolio Monorepo

Este repositorio queda organizado como un monorepo simple con dos aplicaciones separadas:

- `apps/web`: frontend Next.js App Router + TypeScript + Tailwind para desplegar en Vercel
- `apps/api`: backend FastAPI + SQLite + templates/static para desplegar en Render

## Estructura

```text
PORTFOLIO/
  apps/
    web/
      src/
      public/
      package.json
      package-lock.json
      next.config.ts
      middleware.ts
      postcss.config.mjs
      eslint.config.mjs
      next-env.d.ts
      tsconfig.json

    api/
      app.py
      requirements.txt
      runtime.txt
      templates/
      static/
      .env
      .env.example
      ai_portfolio_inbox.db

  .gitignore
  README.md
```

## Frontend local

Desde [apps/web](C:\Users\carlo\Documents\PERSONAL BRANDING\PORTFOLIO\apps\web):

```bash
npm install
npm run dev
```

El frontend espera `NEXT_PUBLIC_INBOX_API_URL` apuntando a la base del backend FastAPI, por ejemplo:

```bash
NEXT_PUBLIC_INBOX_API_URL=http://127.0.0.1:8000
```

## Backend local

Desde [apps/api](C:\Users\carlo\Documents\PERSONAL BRANDING\PORTFOLIO\apps\api):

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app:app --reload
```

URLs locales:

- Frontend: [http://127.0.0.1:3000](http://127.0.0.1:3000)
- Backend: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Dashboard FastAPI: [http://127.0.0.1:8000/dashboard](http://127.0.0.1:8000/dashboard)

## Deploy

- Vercel root directory: `apps/web`
- Render root directory: `apps/api`

### Vercel

- Root directory: `apps/web`
- Build command: `npm run build`
- Install command: `npm install`
- Variable obligatoria:

```bash
NEXT_PUBLIC_INBOX_API_URL=https://portfolio-api-u2xb.onrender.com
```

### Render

- Root directory: `apps/api`
- Build command: `pip install -r requirements.txt`
- Start command:

```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

- Health check:

```bash
/health
```

- Variables recomendadas para produccion:

```bash
APP_BASE_URL=https://carlossm.com
ALLOWED_ORIGINS=https://carlossm.com,https://www.carlossm.com
DATABASE_PATH=/var/data/ai_portfolio_inbox.db
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini
GA4_PROPERTY_ID=...
GOOGLE_SERVICE_ACCOUNT_JSON=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
OWNER_EMAIL=c.sanmiguelortega@gmail.com
```

- Si usas disco persistente de Render, `DATABASE_PATH` debe apuntar al mount path real del disk, no a un archivo efimero del contenedor.

## Notas

- El backend resuelve `templates/`, `static/`, `.env` y la base SQLite de forma relativa a `apps/api/app.py`.
- El frontend quedó ajustado para consumir el backend desde `NEXT_PUBLIC_INBOX_API_URL` y usar `/api/messages` para lecturas del dashboard.
- Artefactos locales de runtime como `.next`, `.venv`, `__pycache__` y `node_modules` no deben versionarse.
