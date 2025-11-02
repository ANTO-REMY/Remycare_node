# Remy Care Connect - Backend API

Node.js + TypeScript + Express + Prisma + SQLite backend for maternal healthcare management system.

## Features

- ✅ JWT Authentication (Access + Refresh Tokens)
- ✅ Role-based Access Control (Mother, CHW, Nurse)
- ✅ Secure Password Hashing (bcrypt)
- ✅ Session Management
- ✅ SQLite Database with Prisma ORM
- ✅ Security Middleware (Helmet, CORS, Rate Limiting)
- ✅ Request Logging (Morgan)
- ✅ TypeScript for Type Safety


## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update JWT secrets and other values

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

## Running the Server

**Development mode:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
npm start
```


## Environment Variables

```env
DATABASE_URL="file:./dev.db"
PORT=3000
ACCESS_TOKEN_SECRET="your-access-token-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
FRONTEND_URL="http://localhost:5173"
```


## Security Features

- **Helmet**: Sets security HTTP headers
- **CORS**: Configured for frontend origin
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT Tokens**: Short-lived access tokens (15min), long-lived refresh tokens (7 days)
- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Track active sessions, device info

## Next Steps

- [ ] Add Zod validation schemas
- [ ] Create Postman collection with auto-auth
- [ ] Implement mother/CHW/nurse specific endpoints
- [ ] Add file upload support
- [ ] Implement real-time notifications (Socket.IO)
- [ ] Add comprehensive error handling
- [ ] Write unit and integration tests

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Morgan
- **Validation**: Zod (planned)


