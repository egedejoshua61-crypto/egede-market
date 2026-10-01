# Deploy Egede Market to Vercel

## Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

## Step 2: Configure Frontend for Vercel

### Update `frontend/package.json`
Make sure your package.json has:
```json
{
  "name": "@egede-market/frontend",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "lucide-react": "^0.469.0"
  }
}
```

### Add `.vercelignore` to frontend
Already included in the repo.

## Step 3: Deploy Frontend

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd frontend
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import GitHub repository `egedejoshua61-crypto/egede-market`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.com` (you'll set this after backend is deployed)

6. Click "Deploy"

## Step 4: Get Your Frontend URL

After deployment, you'll get a URL like:
```
https://egede-market.vercel.app
```

Copy this URL - you'll need it for the backend configuration.

## Step 5: Deploy Backend to Render

Since Vercel is better suited for frontend, deploy the backend to Render:

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create PostgreSQL database:
   - Click "New" → "PostgreSQL"
   - Name: `egede_market`
   - Copy connection URL

4. Create Web Service:
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Configure:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `node src/server.js`

5. Add Environment Variables:
   ```
   DATABASE_URL=<your-postgres-url>
   JWT_SECRET=<generate-random-string>
   CLIENT_URL=https://egede-market.vercel.app
   NODE_ENV=production
   PORT=5000
   JWT_EXPIRES_IN=7d
   ```

6. Deploy and copy your backend URL (e.g., `https://egede-market-api.onrender.com`)

## Step 6: Update Frontend Environment Variable

1. Go back to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Update `VITE_API_URL` to your Render backend URL
5. Redeploy by pushing to main or clicking "Redeploy"

## Step 7: Initialize Database

1. On Render, go to your PostgreSQL instance
2. Click "Connect" → "PSQL"
3. Copy the connection command
4. Run it in your terminal
5. Paste the contents of `backend/src/schema.sql`
6. Press Enter to execute

## Step 8: Test Your Deployment

### Test Backend
```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","app":"Egede Market API"}
```

### Test Frontend
1. Visit `https://your-app.vercel.app`
2. Click "Get started"
3. Register with an email
4. Login
5. Verify dashboard loads

### Test Super Admin
1. Register with email: `egedejoshua61@gmail.com`
2. After registration, check that your role is `SUPER_ADMIN`

## Step 9: Set Up Auto-Deploy (Optional)

Vercel automatically deploys on push to main. To customize:

1. Go to Project Settings → Git
2. Configure branch deployments
3. Set production branch to `main`

## Environment Variables Summary

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (Render)
```
DATABASE_URL=postgresql://user:password@host:5432/egede_market
JWT_SECRET=your-secure-random-key-here
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
PORT=5000
JWT_EXPIRES_IN=7d
```

## Troubleshooting

### Build Fails on Vercel
- Check Node version (needs 18+)
- Verify all dependencies are in package.json
- Check for syntax errors
- Look at build logs: Dashboard → Deployments → Logs

### Frontend shows API errors
- Verify `VITE_API_URL` is correct
- Check CORS is enabled on backend
- Verify backend is running
- Clear browser cache

### Database connection fails
- Use Internal Database URL from Render (not external)
- Verify credentials
- Check schema is initialized

### Auth not working
- Clear localStorage: DevTools → Application → Storage
- Verify JWT_SECRET is set
- Check network requests in DevTools

## Your Deployment URLs

Once deployed:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/api/health`

## Next Steps

✅ Deploy frontend to Vercel
✅ Deploy backend to Render
✅ Create PostgreSQL database
✅ Run database schema
✅ Test authentication
✅ Create super admin account
✅ Monitor in production

Your marketplace is now live! 🎉
