<?php

namespace Server\API\Helpers;

use Server\DAO\DAO;
use Server\Database\ConnectionFactory;
use Server\Database\Query\SelectQueryBuilder;

use function Server\Utils\sendJSON;
use function Server\Utils\getJSONBody;

/**
 * @param DAO $dao
 */
function findUnique($dao) {
    return function (string $name) use ($dao) {
        $conn = ConnectionFactory::newConnection();
        $result = $dao::findUnique($conn, $name);
        $conn->close();

        if ($result->isError()) {
            http_response_code(500);
            $msg = $result->getError();
            echo "Eroare internă: $msg";
            return;
        }

        $json = $result->getData()->getJSON();
        sendJSON($json);
    };
}

/**
 * @param DAO $dao
 * @param string $errorMessage
 */
function delete($dao, $errorMessage) {
    return function (string $id) use ($dao, $errorMessage) {
        $conn = ConnectionFactory::newConnection();
        $result = $dao::delete($conn, $id);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo $errorMessage;
    };
}

/**
 * @param DAO $dao
 * @param string $errorMessage
 */
function update($dao, $errorMessage) {
    return function (string $id) use ($dao, $errorMessage) {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = $dao::update($conn, $id, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo $errorMessage;
    };
}

/**
 * @param DAO $dao
 * @param string $errorMessage
 */
function create($dao, $errorMessage) {
    return function () use ($dao, $errorMessage) {
        $body = getJSONBody();
        $conn = ConnectionFactory::newConnection();
        $result = $dao::create($conn, $body);
        $conn->close();

        if ($result->isSuccess()) {
            http_response_code(204);
            return;
        }

        http_response_code(400);
        echo $errorMessage;
    };
}

/**
 * @param DAO $dao
 */
function find($dao) {
    return function () use ($dao) {
        $builder = new SelectQueryBuilder();
        $conn = ConnectionFactory::newConnection();
        $result = $dao::find($conn, $builder);
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
    };
}

/**
 * @param DAO $dao
 * @param string $route
 * @param string $createError
 * @param string $updateError
 * @param string $deleteError
 * @param \Bramus\Router\Router $router
 */
function genericRoute($router, $route, $dao, $createError, $updateError, $deleteError) {
    $router->mount("/api/$route", function () use ($router, $dao, $createError, $updateError, $deleteError) {
        $router->post(
            "/",
            create($dao, $createError)
        );

        $router->get(
            "/",
            find($dao)
        );

        $router->get(
            "/(\w+)",
            findUnique($dao)
        );

        $router->put(
            "/(\w+)",
            update($dao, $updateError)
        );

        $router->delete(
            "/(\w+)",
            delete($dao, $deleteError)
        );
    });
}
