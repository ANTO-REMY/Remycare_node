# Remy Care Connect Frontend Context

## Overview
Remy Care Connect is a digital health platform designed to connect pregnant mothers, community health workers (CHWs), and nurse supervisors for improved maternal and child health outcomes.

## Key Features
- Secure registration and login for mothers, CHWs, and nurses
- Health check-ins and weekly tips for mothers
- Assignment and monitoring of mothers by CHWs
- Escalation of critical cases to nurse supervisors
- Educational resources for health workers
- Real-time notifications and alerts
- Role-based dashboards for mothers, CHWs, and nurses
- Data privacy and secure verification

## Tech Stack
- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend (original): Python (FastAPI), PostgreSQL
- Other: Docker, Postman, Bun

## User Roles & Flows
### 1. Mother
- Register and login with phone, password, and personal details
- Dashboard: Health check-ins, weekly tips, view assigned CHW, next of kin info
- Profile management

### 2. CHW (Community Health Worker)
- Register and login with phone, password, and location
- Dashboard: List of assigned mothers, escalate cases to nurse, manage health check-ins
- Profile management

### 3. Nurse
- Register and login with phone, password
- Dashboard: View escalated cases, supervise CHWs, resolve cases
- Profile management

## Authentication & Registration
- Role-based registration and login flows
- Demo credentials for quick login (e.g., Mother: +254700000001 | Pass: demo123)
- OTP verification for phone numbers during registration

## Main Pages & Components
- LandingPage: Platform overview, features, impact, navigation
- Login, RegisterMother, RegisterHealthWorker, LoginMother, LoginCHW, LoginNurse: Auth flows
- Dashboards: MotherDashboard, CHWDashboard, NurseDashboard
- Profile components: MotherProfile, CHWProfile, NurseProfile
- Navigation, MobileMenuPanel, Layout

## Data Models (from frontend context)
- User: id, name, phone, role (mother/chw/nurse), location, dueDate, weeksPregnant, nextOfKin
- Case: id, motherId, chwId, nurseId, status, issueType, description, escalation
- HealthCheck: id, motherId, date, status, notes

## API Requirements (implied from frontend)
- Auth: /register, /login, /logout, /verify-otp
- User: /user/profile, /user/update
- Mother: /mother/checkin, /mother/tips, /mother/assigned-chw
- CHW: /chw/mothers, /chw/escalate-case, /chw/checkin
- Nurse: /nurse/escalated-cases, /nurse/resolve-case

## Security & Privacy
- End-to-end encryption (frontend claims)
- HIPAA compliant
- Data privacy and secure verification

## Integration Notes
- Frontend expects RESTful APIs for auth, user, and dashboard features
- Role-based routing and dashboard access
- Real-time notifications (may require WebSocket or polling)

## References
- [Frontend repo](https://github.com/ANTO-REMY/remy-care-connect)
- Demo credentials and flows are present for quick testing

---
This file summarizes the frontend context for backend development and integration. Update as needed when new requirements or features are discovered.