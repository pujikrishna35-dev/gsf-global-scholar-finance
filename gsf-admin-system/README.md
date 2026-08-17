# GSF Admin System (gsf-admin-system)

Standalone Admin CRM Dashboard, REST API Backend, and Database for **GSF Global Scholar Finance**.

> [!IMPORTANT]
> This project is 100% separate from the public GSF website. The public website remains untouched and will communicate with this system via `POST /api/leads`.

## 🚀 Quick Start Guide

### 1. Start Backend API Server
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000/api
```

### 2. Start Admin Dashboard Frontend
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5174
```

## 🔒 Admin Credentials (Demo)
- **Login URL**: `http://localhost:5174/login`
- **Email**: `admin@gsf.com`
- **Password**: `Admin@123`

## 📡 Key API Endpoints
- `POST /api/auth/login` - Admin login authentication
- `GET /api/dashboard/stats` - Summary counts (HOT, MEDIUM, COLD, Applications, Sanctions, Disbursed)
- `GET /api/leads` - List leads with filters (HOT/MEDIUM/COLD, search query)
- `POST /api/leads` - Web form submission API (Ready for future website integration)
- `GET /api/leads/:id` - Detailed student profile, financial info, and activity log
- `PATCH /api/leads/:id` - Update lead classification or application status
- `POST /api/leads/:id/notes` - Add counselor activity note
- `POST /api/leads/:id/follow-up` - Schedule student follow-up
- `GET /api/follow-ups` - Today's, upcoming, and overdue follow-ups
