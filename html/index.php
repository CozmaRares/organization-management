<?php

declare(strict_types=1);

require __DIR__ . "/../server/bootstrap.php";

use Server\DAO\ClientDAO;
use Server\DAO\ClientContractDAO;
use Server\DAO\ProductDAO;
use Server\DAO\SupplierDAO;
use Server\Database\ConnectionFactory;
use Server\Database\Query\SelectQueryBuilder;
use Bramus\Router\Router;
use Server\DAO\SupplierBillDAO;
use Server\Logger;

use function Server\Utils\getJSONBody;
use function Server\Utils\sendJSON;

$router = new Router();

// TODO: add documentation to the functions
// FIX: data is not validated

$router->mount('/api/clienti', function () use ($router) {

    $router->get("/(\w+)", function (string $name) {
        $conn = ConnectionFactory::newConnection();
        $result = ClientDAO::findUnique($conn, $name);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $json = $result->getData()->getJSON();
        sendJSON($json);
    });

    $router->delete("/(\w+)", function (string $id) {
        $conn = ConnectionFactory::newConnection();
        $result = ClientDAO::delete($conn, $id);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-a putut efectua ștergerea clientului";
    });

    $router->put("/(\w+)", function (string $id) {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = ClientDAO::update($conn, $id, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-au putut actualiza datele clientului";
    });

    $router->post("/", function () {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = ClientDAO::create($conn, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-a putut crea clientul";
    });

    $router->get("/", function () {
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
            $json[] = $emp->getJSON();
        }

        sendJSON($json);
    });
});

$router->mount('/api/contracte-clienti', function () use ($router) {

    $router->get("/(\d+)", function (string $id) {
        $conn = ConnectionFactory::newConnection();
        $result = ClientContractDAO::findUnique($conn, $id);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $json = $result->getData()->getJSON();

        sendJSON($json);
    });

    $router->delete("/(\w+)", function (string $id) {
        $conn = ConnectionFactory::newConnection();
        $result = ClientContractDAO::delete($conn, $id);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-a putut efectua ștergerea contractului";
    });

    $router->put("/(\w+)", function (string $id) {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = ClientContractDAO::update($conn, $id, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-au putut actualiza datele contractului";
    });

    $router->post("/", function () {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = ClientContractDAO::create($conn, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-a putut crea contractul";
    });

    $router->get("/", function () {
        $builder = new SelectQueryBuilder();
        $conn = ConnectionFactory::newConnection();
        $result = ClientContractDAO::find($conn, $builder);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $result = $result->getData();
        $json = [];

        foreach ($result as  $contract) {
            $json[] = $contract->getJSON();
        }

        sendJSON($json);
    });
});

$router->mount('/api/produse', function () use ($router) {

    $router->get("/(\w+)", function (string $name) {
        $conn = ConnectionFactory::newConnection();
        $result = ProductDAO::findUnique($conn, $name);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $json = $result->getData()->getJSON();
        sendJSON($json);
    });

    $router->delete("/(\w+)", function (string $id) {
        $conn = ConnectionFactory::newConnection();
        $result = ProductDAO::delete($conn, $id);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-a putut efectua ștergerea produsului";
    });

    $router->put("/(\w+)", function (string $id) {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = ProductDAO::update($conn, $id, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-au putut actualiza datele produsului";
    });

    $router->post("/", function () {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = ProductDAO::create($conn, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-a putut crea produsul";
    });

    $router->get("/", function () {
        $builder = new SelectQueryBuilder();
        $conn = ConnectionFactory::newConnection();
        $result = ProductDAO::find($conn, $builder);
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
            $json[] = $emp->getJSON();
        }

        sendJSON($json);
    });
});

$router->mount('/api/furnizori', function () use ($router) {

    $router->get("/(\w+)", function (string $name) {
        $conn = ConnectionFactory::newConnection();
        $result = SupplierDAO::findUnique($conn, $name);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $json = $result->getData()->getJSON();
        sendJSON($json);
    });

    $router->delete("/(\w+)", function (string $id) {
        $conn = ConnectionFactory::newConnection();
        $result = SupplierDAO::delete($conn, $id);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-a putut efectua ștergerea produsului";
    });

    $router->put("/(\w+)", function (string $id) {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = SupplierDAO::update($conn, $id, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-au putut actualiza datele produsului";
    });

    $router->post("/", function () {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = SupplierDAO::create($conn, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-a putut crea produsul";
    });

    $router->get("/", function () {
        $builder = new SelectQueryBuilder();
        $conn = ConnectionFactory::newConnection();
        $result = SupplierDAO::find($conn, $builder);
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
            $json[] = $emp->getJSON();
        }

        sendJSON($json);
    });
});

$router->mount('/api/facturi-furnizori', function () use ($router) {

    $router->get("/(\w+)", function (string $name) {
        $conn = ConnectionFactory::newConnection();
        $result = SupplierBillDAO::findUnique($conn, $name);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $json = $result->getData()->getJSON();
        sendJSON($json);
    });

    $router->delete("/(\w+)", function (string $id) {
        $conn = ConnectionFactory::newConnection();
        $result = SupplierBillDAO::delete($conn, $id);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-a putut efectua ștergerea facturii";
    });

    $router->put("/(\w+)", function (string $id) {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = SupplierBillDAO::update($conn, $id, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-au putut actualiza datele facturii";
    });

    $router->post("/", function () {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = SupplierBillDAO::create($conn, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo "Nu s-a putut crea factura";
    });

    $router->get("/", function () {
        $builder = new SelectQueryBuilder();
        $conn = ConnectionFactory::newConnection();
        $result = SupplierBillDAO::find($conn, $builder);
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
            $json[] = $emp->getJSON();
        }

        sendJSON($json);
    });
});

$router->set404('/api(/.*)?', function () {
    http_response_code(404);
    $json = array();
    $json['status'] = "404";
    $json['status_text'] = "route not defined";
    sendJSON($json);
});

$router->run(function () {
    $method = $_SERVER['REQUEST_METHOD'];
    $url = $_SERVER['REQUEST_URI'];
    $status = http_response_code();
    Logger::info("$method -> $url $status");
});
