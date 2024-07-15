FROM php:8.3.9-apache

COPY server/ /var/www/html/
COPY vendor/ /var/www/vendor/

RUN "ln -s /var/www/html /var/www/server"
RUN "docker-php-ext-install mysqli"
RUN "docker-php-ext-enable mysqli"
