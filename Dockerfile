FROM php:8.3.9-apache AS base

RUN docker-php-ext-install mysqli
RUN a2enmod rewrite

RUN mkdir -p /var/www/logs
RUN chown -R www-data:www-data /var/www/logs

FROM base AS build

COPY ./html /var/www/html
COPY ./vendor /var/www/vendor
COPY ./server /var/www/server
COPY ./.env /var/www/.env
COPY ./apache2.conf /etc/apache2/apache2.conf

# TODO: load schema
# COPY ./db /var/db
# RUN php /var/db/load_schama.php
# RM /var/db
