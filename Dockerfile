FROM php:8.3.9-apache

RUN docker-php-ext-install mysqli
RUN a2enmod rewrite

RUN mkdir -p /var/www/logs
RUN chown -R www-data:www-data /var/www/logs
