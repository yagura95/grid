#!/bin/bash

ENV=$1
if [ -z "$ENV" ]
then
  echo "Please specify environment: dev, prod"
  exit 1
fi

COMMAND=$2
if [ -z "$COMMAND" ]
then
  echo "Please specify command: up, down, restart, logs, bash, ps"
  exit 1
fi

echo "COMMAND: $COMMAND"
echo "ENV: $ENV"

COMPOSE_EXECUTABLE="$(which docker) compose"
if [ -z "$COMPOSE_EXECUTABLE" ]
then
  COMPOSE_EXECUTABLE=$(which docker-compose)
fi

#execute command
if [ "$COMMAND" = "up" ]
then
  if [ "$ENV" = "dev" ]
  then
    #cd frontend && yarn && yarn husky && cd ..
    echo "No husky available"
  fi
  $COMPOSE_EXECUTABLE -f docker-compose.$ENV.yml up -d
elif [ "$COMMAND" = "down" ]
then
  $COMPOSE_EXECUTABLE -f docker-compose.$ENV.yml down
elif [ "$COMMAND" = "restart" ]
then
  $COMPOSE_EXECUTABLE -f docker-compose.$ENV.yml restart
elif [ "$COMMAND" = "bash" ]
then
  $COMPOSE_EXECUTABLE -f docker-compose.$ENV.yml exec $3 bash
elif [ "$COMMAND" = "logs" ]
then
  $COMPOSE_EXECUTABLE -f docker-compose.$ENV.yml logs $3 $4 $5 $6 $7 $8 $9
else
  echo "Invalid command: $COMMAND"
  exit 1
fi

   
