#!/bin/sh

source ./.env.local
php -S "localhost:$PHP_SERVER_PORT"
