<?php

require "bootstrap.php";

use Server\ConnectionFactory;
use Server\DAO\Employee;

$conn = ConnectionFactory::newConnection();

$e = Employee::findByID($conn, "2");

echo "Name: " . $e->getName();
echo "\nPosition: " . $e->getPosition();
echo "\nSalary: " . $e->getSalary();
echo "\n";

$conn->close();
