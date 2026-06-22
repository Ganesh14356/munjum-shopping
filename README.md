# Munjum

Super Shopping, Cashback, Affiliate & Services Platform.

## Architecture

- `app/` — Next.js App Router pages and UI components
- `src/` — client-side utilities, shared components, and data models
- `server/` — Express API server for Firebase-authenticated backend services
- `public/` — static assets and PWA manifest

## Features

- Modular feature flags driven by Firestore `settings` collection
- Admin dashboard with ON/OFF toggles for modules and content sections
- Firebase Authentication with role-based access in client and API
- Firestore collections for users, products, affiliates, merchants, coupons, deals, orders, tickets, and settings
- PWA-ready with mobile-first responsive UI

## Run locally

1. Install packages
   ```bash
   npm install
   ```

2. Create `.env.local` with your Firebase config and Cashfree keys

3. Start app and API
   ```bash
   npm run dev
   ```
