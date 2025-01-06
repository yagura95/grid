#!/bin/bash

# setup docker env
cp .env.example .env

# setup frontend env
cd frontend 
cp .env.example .env
cd .. 

# setup backend env
cd backend
cp .env.example .env
