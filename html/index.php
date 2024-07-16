<?php

declare(strict_types=1);

require "../server/bootstrap.php";

use Server\DAO\EmployeeDAO;
use Server\Database\ConnectionFactory;
use Server\Database\Query\SelectQueryBuilder;
use Bramus\Router\Router;

$router = new Router();

$router->get("/api/test", function () {
    $conn = ConnectionFactory::newConnection();

    $builder = new SelectQueryBuilder();

    $e = EmployeeDAO::find($conn, $builder);

    foreach ($e as  $emp) {
        echo "Name: " . $emp->getName();
        echo "\nSalary: " . $emp->getSalary();
        echo "\n";
    }

    $conn->close();
});


$router->run();
