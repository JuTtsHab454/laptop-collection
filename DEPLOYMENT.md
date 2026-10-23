# Laptop Collection — Production Deployment Guide

## 1. Prerequisites
- **GitHub Repository**: [https://github.com/JuTtsHab454/laptop-collection](https://github.com/JuTtsHab454/laptop-collection)
- **Vercel Account**: Connected to GitHub account `JuTtsHab454`
- **PostgreSQL Database**: Free cloud database via [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com)

---

## 2. Step-by-Step Vercel Deployment

### Step 2.1 — Create PostgreSQL Database
1. Sign up / Log in to [Neon.tech](https://neon.tech) (recommended) or Supabase.
2. Create a new PostgreSQL project named `laptop-collection`.
3. Copy both connection strings from the project dashboard:
   - **Pooled connection string** (ends with `?sslmode=require`): Use for `DATABASE_URL`
   - **Direct connection string** (port 5432 direct without pgbouncer): Use for `DIRECT_URL`

### Step 2.2 — Deploy to Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Import the repository: `JuTtsHab454/laptop-collection`.
3. Framework Preset: **Next.js** (automatically detected).
4. Root Directory: `./` (or leave default).
5. Build and Output Settings:
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install`
6. Add the following **Environment Variables** in Vercel Project Settings:

| Key | Value / Instructions |
|---|---|
| `DATABASE_URL` | Your pooled PostgreSQL connection string from Neon/Supabase |
| `DIRECT_URL` | Your direct PostgreSQL connection string from Neon/Supabase |
| `NEXTAUTH_SECRET` | A secure random 32+ character string (generate via: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://your-production-domain.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-production-domain.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `923134951239` |
| `NEXT_PUBLIC_CALL_NUMBER` | `923134951239` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (if using Cloudinary) |
| `CLOUDINARY_API_KEY` | Cloudinary API Key (optional) |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret (optional) |

7. Click **Deploy**.

---

## 3. Database Migration & Initial Seed Data

Once your Neon/Supabase database is connected, push the database schema and seed the initial admin account, categories, brands, branches, and default settings:

From your local machine or terminal:
```bash
# Push Prisma schema to cloud database
npx prisma db push

# Seed initial admin account, categories, brands, and settings
npx prisma db seed
```

---

## 4. Initial Admin Credentials & Security Setup

1. Open your production site: `https://your-domain.vercel.app/admin/login`
2. Initial credentials:
   - **Email:** `admin@laptopcollection.pk`
   - **Password:** `Admin@LC2024!`
3. **Important:** After first login, navigate to **Settings** (`/admin/settings`) and:
   - Replace placeholder bank details (`[YOUR BANK NAME]`, account number, IBAN) with your real official account details.
   - Verify WhatsApp and phone numbers.
   - Update your admin password.

---

## 5. Architecture & Vercel Compatibility Highlights
- **Prisma Singleton**: Uses a global cached client in `src/lib/prisma.ts` to prevent connection exhaustion across Vercel Serverless Functions.
- **Atomic Stock Checks**: Orders and inventory stock subtractions are executed in Prisma database transactions (`prisma.$transaction`).
- **Server Price Validation**: All item line totals and option add-ons are strictly re-calculated and verified server-side during checkout.
- **Client Cart Synchronization**: Zustand cart with localStorage persistence and server-side stock awareness.
