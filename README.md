# Description  
## Prerequisites
- Node.js 20.x or later

## Pages
- "/": Random grid generator with or without a bias factor(a character choosen by the user(s)), which refreshes every two seconds. Contains a secret code generated.

## Local Development Setup
1. Set up environment variables:
```bash
cd frontend
cp .env.example .env
```

2. Install frontend dependencies and start dev server:
```bash
cd frontend
yarn install
yarn dev
```

3. Install backend dependencies and start dev server:
```bash
cd backend
yarn install
yarn dev
```

## Environment Variables
### Frontend
Required environment variables:
- `VITE_BACKEND_URL`: Backend application URL. Ex: "http://localhost:4000"

### Backend 
There is a constant variables file, which have:
- `PORT`: port app will use 
- `GRID_COLUMNS`: grid column number
- `GRID_ROWS`: grid rows number
- `BIAS_PERCENT`: bias factor percentage




