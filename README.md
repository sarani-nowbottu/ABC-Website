# ABC Solutions company - Website

Full-stack company website for ABC Solutions company Pvt. Ltd.

## Stack

- **Frontend:** HTML, CSS, JavaScript (forms on Home + Career pages)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (cloud)
- **Deploy:** Vercel + GitHub

---

## Part 1 — Set up MongoDB Atlas (free cloud database)

Follow these steps once. You do not install MongoDB on your computer.

### Step 1: Create a free account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with email or Google
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create a database cluster

1. Click **Build a Database** → choose **M0 FREE**
2. Pick a cloud provider and region close to you (e.g. AWS Mumbai)
3. Name your cluster (e.g. `Cluster0`) and click **Create**

### Step 3: Create a database user

1. Go to **Database Access** (left sidebar) → **Add New Database User**
2. Choose **Password** authentication
3. Set a username and a strong password — **save these**, you need them later
4. Role: **Atlas admin** (or **Read and write to any database**)
5. Click **Add User**

### Step 4: Allow network access (important for Vercel)

1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Required so Vercel servers can reach your database
3. Click **Confirm**

### Step 5: Get your connection string

1. Go to **Database** → click **Connect** on your cluster
2. Choose **Drivers** → Node.js
3. Copy the connection string. It looks like:

   ```
   mongodb+srv://myuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. Replace `<password>` with your real password
5. Add a database name before the `?`, e.g. `whitestone`:

   ```
   mongodb+srv://myuser:MyPass123@cluster0.xxxxx.mongodb.net/whitestone?retryWrites=true&w=majority
   ```

   If your password has special characters (`@`, `#`, `:`), [URL-encode them](https://www.urlencoder.org/).

### Step 6: Add the URI to your project

1. Copy `.env.example` to `.env`
2. Paste your connection string as `MONGODB_URI=...`

### Step 7: Seed sample data (optional but recommended for demo)

```bash
npm run seed
```

This loads job listings and solutions into MongoDB so the Career page shows live data from the database.

---

## Part 2 — Run locally

```bash
npm install
npm run build
npm run dev
```

Open [http://localhost:5000](http://localhost:5000)

### Test the APIs

| Endpoint | Method | What it does |
|----------|--------|--------------|
| `/api/health` | GET | Check if the server and database are working |
| `/api/careers` | GET | List job openings |
| `/api/solutions` | GET | List solution products |
| `/api/contact` | POST | Save contact form (Home page) |
| `/api/careers/apply` | POST | Save job application (Career page) |

**Health check:** open `http://localhost:5000/api/health` — you should see `"database": "connected"`.

**Contact form test** (PowerShell):

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/contact" -Method POST -ContentType "application/json" -Body '{"fullName":"Test User","email":"test@example.com","subject":"Hello","message":"This is a test message for the mentor demo."}'
```

---

## Part 3 — Deploy to Vercel via GitHub

### Before you push to GitHub

- [ ] `.env` is **NOT** in your repo (it is in `.gitignore` — good)
- [ ] `node_modules/` is **NOT** in your repo
- [ ] You have a real `MONGODB_URI` ready to paste into Vercel

### Step 1: Push code to GitHub

1. Create a new repository on [github.com](https://github.com) (e.g. `whitestone-website`)
2. In your project folder:

```bash
git init
git add .
git commit -m "Initial commit - ABC Solutions company website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/whitestone-website.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign up with GitHub
2. Click **Add New Project** → import your GitHub repo
3. Vercel auto-detects settings from `vercel.json`
4. Before deploying, open **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | Your full MongoDB Atlas connection string |
   | `NODE_ENV` | `production` |

5. Click **Deploy**

### Step 3: After deployment

1. Open your Vercel URL (e.g. `https://whitestone-website.vercel.app`)
2. Test: `https://YOUR-URL.vercel.app/api/health`
3. Submit the contact form on the Home page
4. Submit a job application on the Career page
5. In MongoDB Atlas → **Browse Collections**, you should see `contacts` and `jobapplications` collections with your data

### Step 4: Seed data on production (one time)

Run locally with your production `MONGODB_URI` in `.env`:

```bash
npm run seed
```

The same Atlas database is used locally and on Vercel if you use the same URI.

---

## Precautions (important)

1. **Never commit `.env`** — it contains your database password
2. **Never share your MongoDB URI publicly** — anyone with it can read/write your data
3. **Use Network Access `0.0.0.0/0`** only for learning/demo; for production, restrict IPs
4. **Free MongoDB tier** has storage limits — fine for demos
5. **Forms need a connected database** — without `MONGODB_URI`, the website still loads but form submissions will show an error
6. **Do not upload `node_modules`** to GitHub — Vercel runs `npm install` automatically

---

## Project structure

```
api/           → Express server + API routes
models/        → MongoDB schemas (Contact, JobApplication, etc.)
public/        → HTML pages, CSS, JavaScript
scripts/       → seed.js (populate database)
vercel.json    → Vercel routing config
```

## Forms in this project

1. **Contact form** — bottom of the Home page (`/`) → saves to `contacts` collection
2. **Career application form** — Career page (`/career`) → saves to `jobapplications` collection
