# Liveability - Microservices Architecture

A full-stack application with React frontend, API Gateway, and microservices architecture.

## Architecture Overview

```
Frontend (React) → API Gateway → User Service → PostgreSQL Database
```

- **Frontend**: React + TypeScript + Vite (Port 3002)
- **API Gateway**: Fastify + TypeScript (Port 3000)
- **User Service**: Fastify + TypeScript + Prisma (Port 3001)
- **Database**: PostgreSQL (Port 5432)

## Quick Start

### Option 1: Docker Compose (Recommended)

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3002
   - API Gateway: http://localhost:3000
   - User Service: http://localhost:3001
   - Database: localhost:5432

### Option 2: Manual Setup

1. **Install PostgreSQL:**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create database:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE liveability_db;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE liveability_db TO postgres;
   \q
   ```

3. **Start services individually:**
   ```bash
   # Terminal 1 - User Service
   cd user-service
   cp env.example .env
   npm run db:migrate
   npm run dev

   # Terminal 2 - API Gateway
   cd api-gateway
   npm run dev

   # Terminal 3 - Frontend
   cd frontend
   npm run dev
   ```

## API Endpoints

### API Gateway (Port 3000)
- `GET /` - Health check
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user by ID

### User Service (Port 3001)
- `GET /health` - Service health check
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/:id` - Get user by ID

## Development

### Database Management
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

### Adding New Microservices

1. Create new service directory
2. Add service to `compose.yaml`
3. Update API Gateway to route to new service
4. Add service-specific routes

## Environment Variables

### User Service (.env)
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/liveability_db"
PORT=3001
NODE_ENV=development
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## Project Structure

```
Liveability/
├── api-gateway/           # Routes requests to microservices
├── user-service/          # Handles user authentication & management
├── frontend/             # React frontend
├── compose.yaml          # Docker orchestration
└── README.md
```

## Next Steps

- [ ] Add authentication middleware
- [ ] Implement JWT tokens
- [ ] Add more microservices (notifications, analytics)
- [ ] Add proper error handling
- [ ] Add logging and monitoring
- [ ] Add tests