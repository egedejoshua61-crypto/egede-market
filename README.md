# Egede Market

A modern green-themed online marketplace built with React, Tailwind CSS, Express, PostgreSQL, and JWT authentication.

## Features

- Buyer, seller, admin, and super admin roles
- JWT-based auth with protected routes
- Search and filtering for listings
- Seller verification workflow
- Dashboard views for sellers and admins
- PostgreSQL schema for marketplace data
- Docker setup for local development

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL, JWT
- Database: PostgreSQL
- Auth: JWT + bcrypt
- Deployment: Docker-ready, Render/Vercel-friendly

## Project Structure

- `backend/` - Express API
- `frontend/` - React app
- `docker-compose.yml` - Local container orchestration

## Quick Start

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the backend example file:

```bash
cp backend/.env.example backend/.env
```

Update the values for your PostgreSQL setup.

### 3. Start PostgreSQL and services

```bash
docker compose up -d postgres
npm run dev
```

### 4. Initialize database schema

```bash
psql postgresql://postgres:postgres@localhost:5432/egede_market -f backend/src/schema.sql
```

## Super Admin

The account with email `egedejoshua61@gmail.com` is automatically assigned the `SUPER_ADMIN` role on registration.

## Deployment

This repo is structured for deployment on:

- Frontend: Vercel or Netlify
- Backend: Render, Railway, or any Node host
- Database: Supabase or managed PostgreSQL on Render/Railway

## Security

- Password hashing with bcrypt
- JWT validation middleware
- Role-based access checks
- Audit logging support
- Protected routes middleware

## License

MIT
