# Hearth & Home Adoption Portal

React + Express + MySQL authentication for the `adoption_portal` database.

## Setup

1. Upload the database `adoption_portal.sql` in the file ' ./FosterHomes/server/src' to a database Portal like e.g MyPhpAdmin
2. The tables will be Upload

`Server side`
1. Open the server file and install npm 
2. Type `npm install`
3. type `npm run dev`

`client side`
1. Open the client file and install npm 
2. Type `npm install`
3. type `npm run dev`


Open http://localhost:5173.

The API runs on http://localhost:4000. Registration creates both a `users` record and an `applicants` profile, and login checks `u_is_active` before issuing an HTTP-only cookie.
