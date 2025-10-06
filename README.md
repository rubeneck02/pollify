# Pollify - Real-time Polling Application

[Watch Pollify Demo](poll-app-video.mp4)

A modern, real-time polling application built with Svelte, Vite, Express, and WebSockets. Create and participate in live polls with instant results visualization.

## Features

- Create and share polls in real-time
- Live updates using WebSockets
- Responsive design for all devices
- Interactive results visualization
- Simple and intuitive user interface

## Tech Stack

- **Frontend**: Svelte + Vite
- **Backend**: Node.js + Express
- **Real-time Communication**: WebSockets
- **Styling**: Modern CSS with Flexbox/Grid
- **Testing**: Cypress (E2E testing)

## Prerequisites

- Node.js (v14+)
- npm (v7+) or yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd pollify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Project Structure

```
.
├── backend/          # Express server and WebSocket logic
├── frontend/         # Svelte components and application code
├── public/           # Static assets
└── cypress/          # End-to-end tests
```

## Documentation

### Backend API

The backend is built with Express and provides the following endpoints:
- `POST /api/polls` - Create a new poll
- `GET /api/polls/:id` - Get poll details
- `POST /api/polls/:id/vote` - Submit a vote

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT`   | Port to run the server on | 3000 |
| `HOST`   | Host to bind the server to | locahost |

## Testing

Run the test suite with:
```bash
npm test

