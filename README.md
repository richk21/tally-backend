# Tally Backend

The backend API for Tally, a platform for collecting data through survey forms and returning aggregates of that daya to the frontend. This project is built with Node.js and TypeScript, featuring RESTful endpoints and integration with Firebase Firestore.

---

## Features

- REST API for survey submission and dashboard data
- CRUD operations for surveys and locality data
- Data validation and error handling
- Firebase Firestore integration
- Secure environment with dotenv for secrets
- CORS, logging, and request parsing middleware

---

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js**
- **Firebase Firestore**

---

### Prerequisites

- Node.js >= 16.x
- npm (or yarn)

## Getting Started

- Paste these commands in terminal:

```
git clone https://github.com/richk21/tally-backend.git
cd tally-backend
yarn
```

### Environment Variables

- Create a .env file in the root directory `tally-backend`
- add `BACKEND_URL=http://localhost:5000/api`

### Firebase Setup

- Go to Firebase Console and create a project
- Click on `</>` or node icon on the Firebase project dashboard to register the app
- Go to Project Settings and navigate to Service Accounts tab
- Click on `generate new private key`
- Download the JSON file and place it in `src\firebase\` directory
- Import this file as `serviceAccount` in `src\firebase\admin.ts`

### How to run

- Enter `yarn dev` in the root directory
- Navigate to http://localhost:5000

### Swagger

- Enter `yarn dev` in the root directory
- Navigate to http://localhost:5000/api-docs
