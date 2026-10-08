# Hearth & Home Adoption Portal

Problem: I have noticed that the are many south african children who are homeless especially in large cities such as Johannessburg and Cape town for example.
I thik the problem is that the government is relaying on word of mouth to promote their adoption site. So when the children grow up without a proper support 
system when they turn 18.

Solution: The government can intergrate the adoption services to online to do both a remote and in contact inspection of portantial adoptive parents.

React + Express + MySQL authentication for the `adoption_portal` database.

## Setup

1. Upload the database `adoption_portal.sql` in the file `./FosterHomes/server/src` to a database Portal like e.g MyPhpAdmin
2. The tables will be Upload

`Server side`
1. Open the server file and install npm 
2. Type `npm install`
3. Type `npm install multer`
4. type `npm run dev`

`client side`
1. Open the client file and install npm 
2. Type `npm install`
3. type `npm run dev`


Open http://localhost:5173.

The API runs on http://localhost:4000. Registration creates both a `users` record and an `applicants` profile, and login checks `u_is_active` before issuing an HTTP-only cookie.

## Deployment

- Build the client from `client` with `npm ci` and `npm run build`; publish the generated `dist` directory.
- Start the API from `server` with `npm ci` and `npm start`. Configure `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, and `CLIENT_ORIGIN` in the hosting provider. `CLIENT_ORIGIN` must exactly match the deployed client origin.
- Set the client build variable `VITE_API_URL` to the API base URL including `/api` (for example, `https://api.example.com/api`). When the API is reverse-proxied under the same origin at `/api`, it can be left unset.
- Configure static hosting to rewrite application routes to `index.html` so direct visits and refreshes on routes such as `/OurStories` work.
- The authentication cookie uses `SameSite=Lax`; deploy the client and API on the same site or proxy API requests through the client origin so browsers send the session cookie.

## Admin Login details
Email: Homes@gmail.com
Password: Homes@2026
