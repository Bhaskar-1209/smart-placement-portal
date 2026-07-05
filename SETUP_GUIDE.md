# Smart Placement Portal Setup Guide

## Prerequisites

- Node.js 20.19+ recommended
- MongoDB running locally or a MongoDB Atlas URI
- Two terminals: one for `server`, one for `client`

## Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The API runs on `http://localhost:7070`.

## Frontend

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

The app runs on `http://localhost:3000`.

## Roles

- Student and company accounts can register from the UI.
- Admin login is supported at `/login` by selecting role `admin`.
- Create an admin user directly in MongoDB or through a seed script if your college requires fixed credentials.

## Main API Groups

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`
- `GET /api/students`, `GET/PATCH /api/students/me`, `POST /api/students/resume`
- `GET /api/companies`, `GET/PATCH /api/companies/me`
- `GET/POST/PATCH/DELETE /api/jobs`
- `GET /api/applications`, `POST /api/applications/jobs/:jobId/apply`
- `GET/POST/PATCH/DELETE /api/drives`
- `GET/POST/PATCH /api/interviews`
- `GET/POST /api/notifications`
- `GET /api/reports/dashboard`, `/api/reports/export/excel`, `/api/reports/export/pdf`

## Folder Structure

```text
server/
  config/ controllers/ middleware/ models/ routes/ uploads/ utils/
client/
  app/
    components/ context/ hooks/ services/
    admin/ applications/ companies/ dashboard/ jobs/ profile/
```

## Notes

Email sending uses Nodemailer. If SMTP variables are empty, email actions are logged instead of sent so local development keeps working.
