<?php

require "bootstrap.php";

use Server\ConnectionFactory;
use Server\DAO\EmployeeDAO;
use Server\Database\Query\SelectQueryBuilder;

$conn = ConnectionFactory::newConnection();

$builder = (new SelectQueryBuilder())->where(EmployeeDAO::COLUMNS["id"] . " = 1");

$e = EmployeeDAO::find($conn, $builder);

foreach ($e as  $emp) {
    echo "Name: " . $emp->getName();
    echo "\nPosition: " . $emp->getPosition();
    echo "\nSalary: " . $emp->getSalary();
    echo "\n";
}

$conn->close();
