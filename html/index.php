<?php

declare(strict_types=1);

require __DIR__ . "/../server/bootstrap.php";

use Server\DAO\ClientDAO;
use Server\Database\ConnectionFactory;
use Server\Database\Query\SelectQueryBuilder;
use Bramus\Router\Router;

use function Server\Utils\getJSONBody;
use function Server\Utils\sendJSON;
use function Server\Utils\set204;
use function Server\Utils\set500;

$router = new Router();

// TODO: add documentation to the functions
// TODO: wrap db interactions in a try/catch

// TODO: uncaught errors return 200

$router->mount('/api', function () use ($router) {

    $router->delete("/clienti/(\w+)", function (string $id) {
        $conn = ConnectionFactory::newConnection();

        if (ClientDAO::delete($conn, $id)) {
            set204();
        } else {
            set500();
        }

        $conn->close();
    });

    $router->put("/clienti/(\w+)", function (string $id) {
        $body = getJSONBody();

        $conn = ConnectionFactory::newConnection();

        if (ClientDAO::update($conn, $id, $body)) {
            set204();
        } else {
            set500();
        }

        $conn->close();
    });

    // FIX: data is not validated
    $router->post("/clienti", function () {
        $body = getJSONBody();

        $conn = ConnectionFactory::newConnection();

        if (ClientDAO::create($conn, $body)) {
            set204();
        } else {
            set500();
        }

        $conn->close();
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
                "workpoint" => $emp->getWorkpoint(),
                "cif" => $emp->getCIF(),
            ];
        }
        sendJSON($res);
        $conn->close();
    });
});

$router->run();
