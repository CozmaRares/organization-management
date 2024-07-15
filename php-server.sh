#!/bin/sh

source ./.env.local
cd server
php -S "localhost:$PHP_PORT"
