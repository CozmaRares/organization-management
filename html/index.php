<?php

declare(strict_types=1);

require __DIR__ . "/../server/bootstrap.php";

use Server\DAO\EmployeeDAO;
use Server\Database\ConnectionFactory;
use Server\Database\Query\SelectQueryBuilder;
use Bramus\Router\Router;

$router = new Router();

$router->mount('/api', function () use ($router) {

    $router->get('/', function () {
        echo "hello from api";
    });

    $router->get("/test", function () {
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

    /*$router->get('/(\d+)', function($id) {*/
    /*    echo 'id id ' . htmlentities($id);*/
    /*});*/
});



$router->run();
