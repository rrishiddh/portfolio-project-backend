# Portfolio Project — Backend

A powerful and scalable backend service for a personal **developer portfolio application**.  
This backend provides RESTful APIs for managing **projects, blogs, contact messages**, and more — built with Node.js, Express, and Prisma (or any ORM).

---

## Table of Contents

- [ Features](#-features)
- [ Tech Stack](#-tech-stack)
- [ Project Structure](#-project-structure)
- [ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup & Migrations](#database-setup--migrations)
  - [Running Locally](#running-locally)
- [API Endpoints](#-api-endpoints)
- [ Testing](#-testing)
- [ Deployment](#-deployment)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Contact](#-contact)

---

##  Features

-  **CRUD APIs** for projects, blog posts, and contact messages  
-  Authentication & authorization support *(optional)*  
-  Database integration using Prisma / ORM  
-  Input validation & structured error handling  
-  Centralized logging and middleware  
-  Ready to deploy on Vercel, Render or any Node.js hosting platform  

---

##  Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js |
| ORM  | Prisma (or other ORM) |
| Database | PostgreSQL / MySQL / SQLite |
| Deployment | Vercel |
| Tools | Nodemon, ts-node, dotenv, etc. |

---

##  Project Structure

```
portfolio-project-backend/
├── prisma/
│ ├── schema.prisma
│ └── migrations/
├── src/
│ ├── controllers/
│ ├── middlewares/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ └── app.ts
├── .env
├── package.json
├── tsconfig.json
└── vercel.json
```

---

##  Getting Started

### Prerequisites

Make sure you have installed:

- Node.js `>=16.x`
- npm or yarn
- PostgreSQL / MySQL / SQLite database

- Prisma CLI:  
  ```npm
  npm install -g prisma
  ```


## Installation

Clone the repository

```
git clone https://github.com/rrishiddh/portfolio-project-backend.git
cd portfolio-project-backend
```

### Install dependencies
```
npm install
# or
yarn install
```

### Environment Variables
Create a .env file in the project root (or copy .env.example):

```
DATABASE_URL="postgresql://postgres:postgres@db.xytgaqrvmcqnodqrlluz.supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"
GOOGLE_CLIENT_ID="google-id"
GOOGLE_CLIENT_SECRET="google-id"
NODE_ENV="development"
PORT=5000
CLIENT_URL="http://localhost:3000"
```

### Database Setup & Migrations

```
npx prisma migrate dev
npx prisma generate
```

### Running Locally

```
npm run dev
```

## Links: 

### Live Demo (API): [https://portfolio-backend-rrishiddh.vercel.app/](https://portfolio-backend-rrishiddh.vercel.app/)

### Live Demo (Frontend): [https://portfolio-frontend-rrishiddh.vercel.app/](https://portfolio-frontend-rrishiddh.vercel.app/)

### GitHub-Repo-Frontend : [https://github.com/rrishiddh/portfolio-project-frontend](https://github.com/rrishiddh/portfolio-project-frontend)
