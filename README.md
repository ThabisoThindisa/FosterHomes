# Hearth & Home Adoption Portal

React + Express + MySQL authentication for the `adoption_portal` database.

## Setup

1. Import the supplied SQL dump into MariaDB/MySQL as `adoption_portal`.
2. In `server`, copy `.env.example` to `.env` and set the database password and a long `JWT_SECRET`.
3. Install and run the API:

```powershell
cd server
npm install
npm run dev
```

4. In a second terminal, install and run the React app:

```powershell
cd client
npm install
npm run dev
```

Open http://localhost:5173.

The API runs on http://localhost:4000. Registration creates both a `users` record and an `applicants` profile, and login checks `u_is_active` before issuing an HTTP-only cookie.
