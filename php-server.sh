#!/bin/sh

source ./.env.local
cd src
php -S "localhost:$PHP_SERVER_PORT"
