# JobSync

JobSync is a production-ready full-stack application for AI-powered resume analysis, skill gap detection, job readiness scoring, and personalized career planning.

## Features

- JWT authentication and protected routes
- Resume upload with PDF parsing
- Skill detection against target roles
- Job readiness scoring and trend tracking
- Personalized weekly learning roadmap
- Project and certification recommendations
- AI career advisor chatbot
- Persistent history and analysis records
- Responsive dashboard with modern UI
- Role-based Student, Placement Officer, Recruiter, and Super Admin workspaces
- TPO KPIs, branch analytics, skill-gap heatmap data, risk classification, drives, eligibility, reports, and announcements
- Recruiter company profiles, job posting, ranked AI candidate matching, application pipeline, interviews, and feedback storage
- Student open jobs and applications with persisted match scores
- Admin user-role and company management

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer
- pdf-parse
- JWT
- bcryptjs

### AI
- OpenRouter API-ready integration
- fallback local assistant responses when no API key is provided
- Deterministic candidate matching using skills, ATS score, readiness score, projects, and certifications

## Project Structure

```bash
JobSync/
├── client/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── server/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection
- npm
- Optional OpenRouter API key for chatbot enhancement

## Installation

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Update the values in `.env`:

```env
PORT=5000
JWT_SECRET=<long random secret>
MONGODB_URI=mongodb://127.0.0.1:27017/jobsync
CLIENT_ORIGIN=http://localhost:5173
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Start the backend:

```bash
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
```

The default `.env.example` already contains:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## App URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Routes

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Resume
- POST /api/resume/analyze
- GET /api/resume/history

### Chat
- POST /api/chat

### Placement Cell / TPO
- GET /api/tpo/dashboard
- GET /api/tpo/students
- GET /api/tpo/students/:studentId
- GET, POST /api/tpo/drives
- GET /api/tpo/drives/:driveId/eligibility
- PATCH /api/tpo/drives/:driveId

### Recruiter
- GET /api/recruiter/dashboard
- GET, PUT /api/recruiter/company
- GET, POST /api/recruiter/jobs
- GET /api/recruiter/jobs/:jobId/recommendations
- GET /api/recruiter/applications
- PATCH /api/recruiter/applications/:applicationId
- GET, POST /api/recruiter/interviews
- POST /api/recruiter/feedback

### Student Jobs
- GET /api/jobs
- GET /api/applications/me
- POST /api/applications/jobs/:jobId
- GET /api/interviews/me

### Admin, Reports, Notifications
- GET /api/admin/dashboard
- GET /api/admin/users
- PATCH /api/admin/users/:userId/role
- GET /api/admin/companies
- GET /api/reports/placement
- GET, POST /api/notifications
- PATCH /api/notifications/:notificationId/read

### Health
- GET /api/health

## Notes

- The app includes a local MongoDB fallback for development: `mongodb://127.0.0.1:27017/jobsync`
- Local development registration can create each role to exercise the portals. In production, registration is forced to the `student` role; promote staff through the admin workflow or a controlled seed process.
- Portal URLs are `/placement`, `/recruiter`, and `/admin`; the existing student experience remains at `/dashboard`, `/upload`, `/chat`, `/profile`, and `/jobs`.
- If you're using OpenRouter, add your API key to `server/.env` and the chat endpoint will use it.
- If no API key is set, the chatbot still responds with a useful local guidance message.

## License

MIT
