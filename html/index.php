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
// FIX: data is not validated

$router->mount('/api', function () use ($router) {

    $router->delete("/clienti/(\w+)", function (string $id) {
        $conn = ConnectionFactory::newConnection();
        $result = ClientDAO::delete($conn, $id);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $result = $result->getData();

        if ($result === false) {
            http_response_code(400);
            echo "Nu s-a putut efectua ștergerea clientului";
            return;
        }

        http_response_code(204);
        return;
    });

    $router->put("/clienti/(\w+)", function (string $id) {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = ClientDAO::update($conn, $id, $body);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $result = $result->getData();

        if ($result === false) {
            http_response_code(400);
            echo "Nu s-au putut actualiza datele clientului";
            return;
        }

        http_response_code(204);
        return;
    });

    $router->post("/clienti", function () {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = ClientDAO::create($conn, $body);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $result = $result->getData();

        if ($result === false) {
            http_response_code(400);
            echo "Nu s-a putut adăuga clientul";
            return;
        }

        http_response_code(204);
    });

    $router->get("/clienti", function () {
        $builder = new SelectQueryBuilder();
        $conn = ConnectionFactory::newConnection();
        $result = ClientDAO::find($conn, $builder);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $result = $result->getData();
        $json = [];

        foreach ($result as  $emp) {
            $json[] = [
                "name" => $emp->getName(),
                "address" => $emp->getAddress(),
                "workpoint" => $emp->getWorkpoint(),
                "cif" => $emp->getCIF(),
            ];
        }

        sendJSON($json);
    });
});

$router->run();
