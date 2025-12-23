# MERN Ticketing System

## Setup

1. **Prerequisites**
   - Node.js
   - Docker & Docker Compose

2. **Start Database**
   ```bash
   docker compose up -d
   ```

3. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server runs on http://localhost:5000

4. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs on http://localhost:5173

## Features implemented
- User Authentication (Register/Login) with JWT
- Ticket Management (Create, View, Update, Delete)
- Protected Routes
- Redux Toolkit State Management
- TypeScript on both ends
- MongoDB via Docker
