<?php

require "bootstrap.php";

use Server\DAO\EmployeeDAO;
use Server\Database\ConnectionFactory;
use Server\Database\Query\SelectQueryBuilder;

use function Server\Database\Query\_eq;

$conn = ConnectionFactory::newConnection();

$builder = (new SelectQueryBuilder())->where(_eq(EmployeeDAO::COLUMNS["id"], "1"));

$e = EmployeeDAO::find($conn, $builder);

foreach ($e as  $emp) {
    echo "Name: " . $emp->getName();
    echo "\nPosition: " . $emp->getPosition();
    echo "\nSalary: " . $emp->getSalary();
    echo "\n";
}

$conn->close();
