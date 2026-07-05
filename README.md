# Smart Placement Portal

A full-stack placement management system for colleges with role-based dashboards for admins, students and companies.

## Tech Stack

- Frontend: Next.js App Router, React 19, Tailwind CSS, Axios, React Hook Form, React Hot Toast, React Icons, Chart.js
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer, Nodemailer, Helmet, Morgan, Express Validator

## Features

- Student, company and admin authentication
- Forgot/reset password flow
- JWT protected REST APIs and role-based authorization
- Student profile, skills, education-ready schema and resume PDF upload
- Company profile and job posting
- Job search/filter, eligibility fields and application tracking
- Application shortlist/reject/offer status updates
- Placement drives, interviews and notifications
- Admin dashboard charts, statistics, CSV export and PDF-style summary export

## Run Locally

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

The frontend expects the API at `http://localhost:7070/api` by default.
