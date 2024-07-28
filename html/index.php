<?php

declare(strict_types=1);

require __DIR__ . "/../server/bootstrap.php";

use Server\DAO\ClientDAO;
use Server\Database\ConnectionFactory;
use Server\Database\Query\SelectQueryBuilder;
use Bramus\Router\Router;

$router = new Router();

$router->mount('/api', function () use ($router) {
    header('Content-Type: application/json; charset=utf-8');

    $router->get('/', function () {
        echo "hello from api";
    });

    $router->get("/clienti", function () {
        $conn = ConnectionFactory::newConnection();
        $builder = new SelectQueryBuilder();
        $e = ClientDAO::find($conn, $builder);
        $res = [];

        foreach ($e as  $emp) {
            $res[] = [
                "name" => $emp->getName(),
                "address" => $emp->getAddress(),
                "workplace" => $emp->getWorkplace(),
                "cif" => $emp->getCIF(),
            ];
        }
        echo json_encode($res);
        $conn->close();
    });

    /*$router->get('/(\d+)', function($id) {*/
    /*    echo 'id id ' . htmlentities($id);*/
    /*});*/
});

$router->run();
