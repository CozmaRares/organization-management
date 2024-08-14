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

use function Server\API\Helpers\genericRoute;

$router = new Router();

// TODO: add documentation to the functions
// FIX: data is not validated

genericRoute(
    $router,
    "clienti",
    new ClientDAO(),

    "Nu s-a putut crea clientul",
    "Nu s-au putut actualiza datele clientului",
    "Nu s-a putut efectua ștergerea clientului",
);

genericRoute(
    $router,
    "contracte-clienti",
    new ClientContractDAO(),

    "Nu s-a putut crea contractul",
    "Nu s-au putut actualiza datele contractului",
    "Nu s-a putut efectua ștergerea contractului",
);

genericRoute(
    $router,
    "produse",
    new ProductDAO(),

    "Nu s-a putut crea produsul",
    "Nu s-au putut actualiza datele produsului",
    "Nu s-a putut efectua ștergerea produsului",
);

genericRoute(
    $router,
    "furnizori",
    new SupplierDAO(),

    "Nu s-a putut crea produsul",
    "Nu s-au putut actualiza datele produsului",
    "Nu s-a putut efectua ștergerea produsului",
);

genericRoute(
    $router,
    "facturi-furnizori",
    new SupplierBillDAO(),

    "Nu s-a putut crea factura",
    "Nu s-au putut actualiza datele facturii",
    "Nu s-a putut efectua ștergerea facturii",
);

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
