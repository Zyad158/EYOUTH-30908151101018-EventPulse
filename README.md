# EventPulse — Event Management Backend API

A complete, production-ready Backend API for an event management platform. Built as the Semester 2 final project for JavaScript Backend Essentials, Level 4.

Attendees can browse and search events, register for them (with capacity limits and duplicate-registration protection), and receive real-time announcements from organizers. Admins can manage events and broadcast live announcements to attendees of a specific event.

## Live Deployment

- **API base URL:** `https://eyouth-30908151101018-event-pulse.vercel.app`
- **Health check:** `https://eyouth-30908151101018-event-pulse.vercel.app/health`
- **Interactive API docs (Swagger):** `https://eyouth-30908151101018-event-pulse.vercel.app/api-docs`

> Replace the placeholder above with your actual Vercel URL after deployment.

## Tech Stack

- **Runtime / Framework:** Node.js, Express
- **Database:** MongoDB with Mongoose (MongoDB Atlas in production)
- **Auth:** JWT (jsonwebtoken) + bcrypt password hashing
- **Real-time:** Socket.io
- **Validation:** express-validator
- **Docs:** swagger-jsdoc + swagger-ui-express, Postman Collection
- **Testing:** Jest + Supertest + mongodb-memory-server
- **Deployment:** Vercel (serverless) + MongoDB Atlas

## Project Structure (MVC)

```
EYOUTH-30908151101018-EventPulse/
├── models/          # Mongoose schemas: User, Category, Event, Registration, Message
├── controllers/      # Business logic per resource
├── routes/           # Express routers + Swagger JSDoc annotations
├── middleware/       # requireAuth, requireRole, validate, validators, errorHandler
├── utils/             # AppError, asyncHandler
├── config/            # db.js (MongoDB connection), socket.js (Socket.io), swagger.js
├── tests/
│   ├── unit/          # AppError, asyncHandler
│   └── integration/   # Events API (Supertest)
├── postman/            # Postman Collection + "EventPulse Dev" Environment
├── seed.js             # Seeds sample categories, events, admin + attendee users
├── app.js               # App entry point (Express + HTTP server + Socket.io)
├── vercel.json
└── .env.example
```

## Local Installation

```bash
# 1. Clone the repository
git clone https://github.com/Zyad158/EYOUTH-30908151101018-EventPulse.git
cd EYOUTH-30908151101018-EventPulse

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then edit .env with your own MONGO_URI and JWT_SECRET

# 4. Seed the database with sample data (categories, events, admin/attendee users)
npm run seed

# 5. Start the server
npm run dev      # with nodemon, or
npm start         # plain node
```

The server runs on `http://localhost:3000` by default. Sample admin login after seeding:
`admin@eventpulse.com` / `Admin@123`.

## Running Tests

```bash
npm test
```

Runs the Jest unit test suite (`AppError`, `asyncHandler`) and the Supertest integration suite for the Events API (uses an in-memory MongoDB instance, no external DB required).

## API Endpoint Summary

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and receive a JWT | Public |
| GET | `/api/events` | List events (filter, paginate, sort, search) | Public |
| GET | `/api/events/:id` | Get a single event (populated) | Public |
| POST | `/api/events` | Create an event | Admin |
| PATCH | `/api/events/:id` | Update an event | Admin |
| DELETE | `/api/events/:id` | Delete an event | Admin |
| POST | `/api/registrations` | Register for an event | Authenticated |
| GET | `/api/registrations/my` | List my registrations | Authenticated |
| DELETE | `/api/registrations/:id` | Cancel my registration | Authenticated |
| POST | `/api/announcements` | Broadcast a live announcement | Admin |
| GET | `/api/announcements/:eventId` | Announcement history for an event | Public |
| GET | `/health` | Server & database health status | Public |
| GET | `/api-docs` | Interactive Swagger UI | Public |

## Real-Time Announcements (Socket.io)

- Client connects and joins an event room: `socket.emit('join-event', eventId)`
- When an admin posts `POST /api/announcements`, the server persists it and emits:
  `io.to(eventId).emit('announcement', message)` — only attendees in that event's room receive it.
- `GET /api/announcements/:eventId` returns the full history so late joiners don't miss anything.

## Postman

Import both files from the `postman/` folder into Postman:
- `EventPulse.postman_collection.json` — requests grouped into Auth, Events, Registrations, Announcements, Health
- `EventPulse.postman_environment.json` — the **EventPulse Dev** environment (`baseUrl`, `token`, and a few convenience IDs)

Select the environment, log in via the Auth folder, copy the returned token into the `token` environment variable, then run any protected request.

## Environment Variables

See `.env.example`:

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on locally |
| `NODE_ENV` | `development` \| `production` \| `test` |
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |

`.env` is git-ignored — never commit real secrets. `.env.example` documents the required keys without real values.
