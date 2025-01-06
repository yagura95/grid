# Description  
Complete grid application with proper environment setup, development dependencies and scripts and CI/CD.  
Uses redis for fast and non persistent in memory data (grid information) and mariadb for persistent storage(payments).

## Prerequisites
- Docker 
- Node.js 20.x or later

## Pages
- "/": Random grid generator with or without a bias factor(a character choosen by the user(s)), which refreshes every two seconds. Contains a secret code generated.
- "/payments": Payments added by the user(s). Also contains the secret code.

## Scripts  
### docker-control 
Helper script to control docker envs and commands.  
It can be run with one of two environments(required): dev or prod.  

Examples: 
- start dev env: ```bash ./docker-control.sh dev up```
- stop dev env: ```bash ./docker-control.sh dev down```
- start prod env: ```bash ./docker-control.sh prod up```
- stop prod env: ```bash ./docker-control.sh dev down```
- restart: ```bash ./docker-control.sh dev restart```
- logs: ```bash ./docker-control.sh dev logs```
- logs frontend: ```bash ./docker-control.sh dev logs frontend -f```
- container shell: ```bash ./docker-control.sh dev bash frontend```

### setup-envs.sh
Script that copies .env.example files to .env files across entire project. Must be executed from root folder.
```bash
./scripts/setup-envs.sh
```

### frontend.dev.sh && backend.dev.sh
Commands executed when docker containers start.

## Local Development Setup
```
./scripts/setup-envs.sh

# change variables in .env files as needed

./docker-control.sh dev up
```

## Environment Variables
### Frontend
Required environment variables:
- `VITE_BACKEND_URL`: Backend application URL. Ex: "http://localhost:4000"
- `VITE_BACKEND_TOKEN`: WebSocket auth secret. Must match backend secret. 

### Backend 
There is a constant variables file, which have:
- `PORT`: port app will use 
- `GRID_COLUMNS`: grid column number
- `GRID_ROWS`: grid rows number
- `BIAS_PERCENT`: bias factor percentage
- `TOKEN`: auth token. should be in a .env in production. 




