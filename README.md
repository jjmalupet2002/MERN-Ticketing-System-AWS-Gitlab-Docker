# MERN Ticketing System

## Setup

1. **Prerequisites**
   - Node.js
   - Docker & Docker Compose
     - *Note: On Linux, you may need to install the Compose plugin separately (e.g., `sudo apt install docker-compose-plugin` or `sudo apt install docker-compose`).*

2. **Docker Setup (Recommended)**

   **Development**:
   Start all services with hot-reloading:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

   **Production**:
   Start all services in production mode:
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```
   - Frontend: http://localhost:80

3. **Manual Setup (Local)**
   
   **Start Database**:
   ```bash
   docker compose -f docker-compose.dev.yml up -d mongo
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
