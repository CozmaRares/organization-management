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
        volumes:
            - ./sql_data:/var/lib/mysql
        networks:
            org-management:
                aliases:
                - mysql

    phpmyadmin:
        image: phpmyadmin:5.2.0
        environment:
            PMA_HOST: mysql
            PMA_PORT: 3306
        ports:
            - ${PMA_PORT}:80
        networks:
            org-management:
                aliases:
                - phpmyadmin
        depends_on:
            - mysql

    apache:
        build: .
        ports:
            - 6969:80
        volumes:
          - ./html:/var/www/html
          - ./vendor:/var/www/vendor
          - ./server:/var/www/server
          - ./.env.local:/var/www/.env.local
          - ./apache2.conf:/etc/apache2/apache2.conf
        networks:
            org-management:
                aliases:
                - apache
        depends_on:
            - mysql
EOF
