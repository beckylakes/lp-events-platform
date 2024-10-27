# Eventure: Your Music Adventure Starts Here 🎶🤩
Welcome to Eventure, an event platform targeted at helping to connect you with all the latest events across the globe and locally.

## Project Summary 📚
Eventure is an events platform created to allow music lovers to discover global or local events, and also provides a platform for event organisers to share their events with the community.

* Normal users can login, browse other users, upcoming events and upon finding their ideal event can, with a click of the button, begin attending. They will then have the option to add it to their calendar, or if they change their mind, they can choose to stop attending.

* Organisers can also login and browse the same information as normal users, however they will have special permissions such as viewing a page of their created events, the create-an-event page, and the important ability to delete any event they make.

### Hosted Version
Find my live webpage [here](https://eventure-lp.netlify.app/home).
*Please note: using this service may be slow for some - please use with patience!*

## Tech Stack & Requirements 🤖
### Backend
* MongoDB (a MongoDB database & free API key is required - please refer to their docs [here](https://www.mongodb.com/docs/atlas/getting-started/) for setup)
* Express
* Node.js (minimum version: 20.0.0)
* Ticketmaster (an free API key for their Discovery API is required - please follow their docs [here](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/))

### Frontend
* React.js (minimum version: 18.0.0)
* Hosted on Netlify

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

### Seeding test data to your MongoDB database:
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

## Additional Information 📝
For any questions or issues, please let me know [here](https://github.com/beckylakes/lp-events-platform/issues).
