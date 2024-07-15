FROM php:8.3.9-apache

RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
