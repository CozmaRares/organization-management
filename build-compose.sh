#!/bin/sh

set -o errexit -o nounset

env_file="./.env.local"
compose_file="./docker-compose.yaml";

source "$env_file"

cat <<EOF > "$compose_file"
networks:
    org-management:
        driver: bridge

volumes:
    sql_data:

services:
    mysql:
        image: mysql:8.0
        environment:
            MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
            MYSQL_DATABASE: ${MYSQL_DATABASE}
        ports:
            - ${MYSQL_PORT}:3306
        networks:
            org-management:
                aliases:
                - mysql
        volumes:
            - ./sql_data:/var/lib/mysql

    phpmyadmin:
        image: phpmyadmin:5.2.0
        links:
            - mysql
        environment:
            PMA_HOST: mysql
            PMA_PORT: 3306
        ports:
            - ${PMA_PORT}:80
        networks:
            org-management:
                aliases:
                - phpmyadmin

    apache:
        build: .
        ports:
            - 6969:80
        networks:
            org-management:
                aliases:
                - apache
        volumes:
          - ./html:/var/www/html
          - ./vendor:/var/www/vendor
          - ./server:/var/www/server
        depends_on:
            - mysql
EOF
