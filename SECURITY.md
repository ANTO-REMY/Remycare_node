# Security Features & Best Practices

## Implemented Security Measures

### 1. Authentication & Authorization
- **JWT-based authentication** with access tokens (15min) and refresh tokens (7 days)
- **Role-based access control (RBAC)** with middleware for mother, CHW, and nurse roles
- **Session management** with device tracking and IP logging
- **Account status validation** to block deactivated users

### 2. Input Validation & Sanitization
- **Zod schema validation** for all request inputs (body, query, params)
- **Input sanitization middleware** to prevent XSS attacks
- Removal of potentially dangerous characters like `<` and `>`
- Request body size limits (10MB) to prevent DOS attacks

### 3. Rate Limiting
- **Global rate limiting**: 100 requests per 15 minutes per IP
- **Sensitive endpoint rate limiting**: 5 attempts per 15 minutes for:
  - Login endpoint
  - Registration endpoint
- Custom rate limiting available for other sensitive operations

### 4. Security Headers
- **helmet.js** for comprehensive HTTP header security
- **X-Frame-Options: DENY** - Prevents clickjacking
- **X-Content-Type-Options: nosniff** - Prevents MIME-type sniffing
- **X-XSS-Protection: 1; mode=block** - XSS filter enabled
- **Referrer-Policy: strict-origin-when-cross-origin** - Referrer control

### 5. CORS Configuration
- Whitelist-based origin validation
- Credentials support for authenticated requests
- Configurable via `FRONTEND_URL` environment variable

### 6. Database Security
- **Prisma ORM** with parameterized queries (prevents SQL injection)
- **UUID primary keys** instead of sequential IDs
- **Password hashing** with bcrypt (10 rounds)
- **Audit logging** for sensitive operations

### 7. HTTPS Enforcement
- Middleware to enforce HTTPS in production
- Returns 403 Forbidden if accessed over HTTP in production

### 8. Error Handling
- Generic error messages to prevent information leakage
- Detailed logging for debugging (development only)
- Stack traces hidden from client in production

---

## Security Best Practices for Production

### Environment Variables
1. **Never commit `.env` file** to version control
2. **Use strong, random secrets** for JWT tokens:
   ```bash
   # Generate secure secrets
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
3. **Set NODE_ENV=production** in production environment
4. **Use environment-specific DATABASE_URL** for production database

### Database
1. **Regular backups** of the SQLite database
2. **Restrict database file permissions** (read/write only for app user)
3. **Enable WAL mode** for better concurrency:
   ```sql
   PRAGMA journal_mode=WAL;
   ```
4. **Consider PostgreSQL** for production at scale

### Network & Infrastructure
1. **Always use HTTPS** in production (configure reverse proxy/load balancer)
2. **Use a reverse proxy** (Nginx, Caddy) with:
   - Rate limiting
   - Request size limits
   - Timeout configurations
3. **Firewall rules** to restrict database access
4. **Separate environments** (dev, staging, production)

### Monitoring & Logging
1. **Monitor rate limit hits** to detect attacks
2. **Log failed authentication attempts**
3. **Set up alerts** for:
   - Multiple failed logins
   - Unusual traffic patterns
   - High error rates
4. **Audit logs review** regularly

### Session Management
1. **Session expiry is enforced** (refresh tokens expire after 7 days)
2. **Logout invalidates sessions** in the database
3. **Consider adding**:
   - Session timeout on inactivity
   - Maximum concurrent sessions per user
   - Force logout on password change

### Dependencies
1. **Regularly update dependencies**:
   ```bash
   npm audit
   npm audit fix
   npm outdated
   ```
2. **Review security advisories** for critical packages
3. **Use `npm ci`** in production for reproducible builds

### Code Security
1. **Never log sensitive data** (passwords, tokens, PII)
2. **Sanitize logs** before storing
3. **Code reviews** for security vulnerabilities
4. **Static analysis** tools (ESLint security plugins)

---

## API Security Checklist

- [x] Authentication on all protected endpoints
- [x] Role-based authorization
- [x] Input validation with Zod
- [x] Rate limiting (global + sensitive endpoints)
- [x] CORS configuration
- [x] Security headers (helmet.js)
- [x] SQL injection prevention (Prisma)
- [x] XSS prevention (input sanitization)
- [x] Password hashing (bcrypt)
- [x] JWT with expiry
- [x] Audit logging
- [x] Error handling without data leakage
- [x] Request size limits
- [ ] HTTPS enforcement (requires production setup)
- [ ] Security penetration testing
- [ ] Regular dependency audits

---

## Security Middleware Usage

### Apply to All Routes
```typescript
// app.ts
app.use(sanitizeInput);      // XSS prevention
app.use(securityHeaders);    // Security headers
app.use(checkAccountStatus); // Block deactivated accounts
```

### Apply to Specific Routes
```typescript
// Sensitive rate limiting
import { sensitiveRateLimit } from '../middleware/security.js';
router.post('/login', sensitiveRateLimit(5), controller.login);

// Fresh session required
import { requireFreshSession } from '../middleware/security.js';
router.put('/change-password', requireFreshSession(10), controller.changePassword);
```

---

## Reporting Security Issues

If you discover a security vulnerability, please email:
**security@remycare.example.com**

Do NOT create public GitHub issues for security vulnerabilities.

---

## Compliance Considerations

For maternal healthcare, consider:
1. **HIPAA compliance** (US) - PHI protection
2. **GDPR compliance** (EU) - Data privacy
3. **Data residency** requirements
4. **Encryption at rest** for sensitive data
5. **Secure data deletion** when required
6. **Patient consent management**

**Note**: Current implementation provides basic security. For healthcare production use, consult with security professionals and legal advisors.
