# Postman Setup Guide

## Import Collection

1. Open Postman
2. Click **Import** button
3. Select `postman_collection.json` from the project root
4. Collection will be imported with all endpoints

## Configure Environment

1. Create a new environment in Postman (e.g., "Remy Care Local")
2. Add the following variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| baseUrl | http://localhost:3000/api | http://localhost:3000/api |
| accessToken | (leave empty) | (auto-populated) |
| refreshToken | (leave empty) | (auto-populated) |

3. Select this environment from the dropdown in top-right corner

## Automatic Token Management

The collection includes pre-request and test scripts that automatically:

- Save access and refresh tokens after login/register
- Check if access token is expired before each request
- Automatically refresh the token if needed (2 minutes before expiry)
- No need to manually copy/paste tokens

## Testing Flow

### 1. Health Check
Run the **Health Check** endpoint first to verify server is running.

### 2. Register Users
Register test users for each role:
- **Register Mother** - Creates a mother user
- **Register CHW** - Creates a Community Health Worker
- **Register Nurse** - Creates a nurse user

### 3. Login
Login with any registered user:
- **Login Mother** - Login as mother (tokens auto-saved)
- **Login CHW** - Login as CHW (tokens auto-saved)
- **Login Nurse** - Login as nurse (tokens auto-saved)

### 4. Protected Endpoints
After login, all protected endpoints will automatically use the saved access token.

### 5. Token Refresh
The **Refresh Token** endpoint is available for manual testing, but tokens are automatically refreshed before each request if needed.

### 6. Logout
Use the **Logout** endpoint to invalidate the current session.

## Troubleshooting

### Token Not Working
- Ensure you've logged in first
- Check that `accessToken` variable is populated in your environment
- Try logging in again

### 401 Unauthorized
- Token may have expired
- Run the **Refresh Token** endpoint manually
- Or login again to get new tokens

### Connection Refused
- Ensure backend server is running: `npm run dev`
- Check that PORT in .env matches baseUrl in Postman (default: 3000)

## Sample Request Bodies

### Register Mother
```json
{
  "phone": "+254701234567",
  "password": "SecurePass123!",
  "name": "Grace Wanjiku",
  "role": "mother",
  "email": "grace@example.com",
  "location": "Nairobi"
}
```

### Login
```json
{
  "phone": "+254701234567",
  "password": "SecurePass123!",
  "role": "mother"
}
```

### Refresh Token
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

## Expected Responses

### Successful Registration/Login
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "Grace Wanjiku",
    "phone": "+254701234567",
    "role": "mother"
  }
}
```

### Health Check
```json
{
  "status": "ok",
  "timestamp": "2025-11-02T15:22:00.000Z"
}
```

### Error Response
```json
{
  "error": "Invalid credentials"
}
```

## Notes

- All authentication endpoints (register, login, refresh) do not require authentication
- Logout endpoint requires a valid access token
- Tokens are stored in environment variables and persist across requests
- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days
