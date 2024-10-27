# Eventure: Your Music Adventure Starts Here 🎶🤩
Welcome to Eventure, an event platform targeted at helping to connect you with all the latest events across the globe and locally.

## Project Summary 📚
Eventure is an events platform created to allow music lovers to discover global or local events, and also provides a platform for event organisers to share their events with the community.
In this project I have learned in great detail on RBAC (Role Based Access Control) and authentication using access/refresh tokens throughout my backend and frontend code. My backend server acts as a RESTful API for my accessible frontend which is deployed on Netlify.

* Normal users can login, browse other users, upcoming events and upon finding their ideal event can, with a click of the button, begin attending. They will then have the option to add it to their calendar, or if they change their mind, they can choose to stop attending.

* Organisers can also login and browse the same information as normal users, however they will have special permissions such as viewing a page of their created events, the create-an-event page, and the important ability to delete any event they make.

### Hosted Version
Find my live webpage [here](https://eventure-lp.netlify.app/home).
*Please note: using this service may be slow for some - please use with patience!*

Feel free to sign up/login as your own user on my website, but if you prefer, I have some example accounts below:
* Normal User (cannot make events): user@gmail.com | password: Password123!
* Organiser User (can make events): organiser@gmail.com | password: Organiser123!
  
## Tech Stack & Requirements 🤖
### Backend
* MongoDB (a MongoDB database & free API key is required - please refer to their docs [here](https://www.mongodb.com/docs/atlas/getting-started/) for setup)
* Express
* Node.js (minimum version: 20.0.0)
* Ticketmaster (an free API key for their Discovery API is required - please follow their docs [here](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/))
* Jest/Supertest

### Frontend
* React.js (minimum version: 18.0.0)
* Hosted on Netlify
* Chrome dev tools (including Lighthouse)

## Running the Service 👩‍💻

### Clone the repository in your terminal
```bash
git clone https://github.com/beckylakes/lp-events-platform.git
```
### Navigate to the 'client' folder with 'cd' & run 'npm install':
```bash
cd lp-events-platform/client
npm install
```
### Navigate into the 'lp-events-platform/server' with 'cd' & run 'npm install':
```bash
cd ../server
npm install
```
### In this directory (/server), create a .env file with:
```bash
touch .env
```

### Add the following to your .env file, replacing each value with your own API keys (with quote marks!) where instructed:
*For the access and refresh tokens, write 'node' in the terminal and then type require('crypto').randomBytes(64).toString('hex'). Copy the output without the quote marks*
```
MONGO_URI=<YOUR_MONGODB_DATABASE_URL>

API_KEY=<YOUR_TICKETMASTER_API_KEY>

ACCESS_TOKEN_SECRET=<YOUR_NODE_CRYPTO_HERE>
REFRESH_TOKEN_SECRET=<YOUR_NODE_CRYPTO_HERE>

FRONTEND_URL="http://localhost:5173" (or where your frontend will be ran locally)
```

### 🌱🌱 Seeding test data to your MongoDB database:
In /server, run:
```
npm test
```
Your terminal should show all tests passing, and let you know if data has correctly been seeded!

### Run the backend server locally:
```
npm run dev
```
This will start the local development server on port 9090 and you should see confirmation in your terminal.

### Run the frontend locally:
While your backend is still running, open another terminal and direct yourself into /client and run:
```
npm run dev
```
Open the link that is given in the terminal and make sure to write '/home' as the endpoint.

## Phew! You made it 🎉🎉🎉
Glad you've made it this far! From this point, you can now sign up as a new user (use any random email you like - I've been using test@test.com for weeks!) and follow the instructions for making a password (may I suggest the classic 'Password123!' combo?). After signing up, you will need to login using the same details you just signed up with and you should now be signed in as a user.

Feel free to peruse the events and click the attend button on as many as you like. If you want to view which events you're going to, click on 'My Account' in the navigation and you'll get a nice summary there. On your account page, you can also choose to become an Event Organiser with the click of a button. Upon doing so, you will now see some new options pop up to create an event, or view your events page. Again, feel free to create any test events or delete them if you so wish.

I've tried to keep everything nice and accessible, and hope my website/app can be used by all peoples!

## To do list 📝
* Improve upon CSS and accessibility (such as buttons being potentially too small)
* Build a functioning search bar where you can search for nearby events, or by date or tags/keywords
* A user settings page where you can edit or delete your user
* More social features: see who is attending an event, becoming friends with people attending the same event, sharing events via socials (I realised early on in the project that these particularly pose security risks to users that, given the timeframe, I felt I could not effectively address so these have been left for now!)
* 0Auth sign in
* Payments API integration or a pay-as-you-feel charge
* Confirmation emails upon signing up, and also upon attending an event

## Additional Information 📝
For any questions or issues, please let me know [here](https://github.com/beckylakes/lp-events-platform/issues).
