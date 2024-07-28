<?php

declare(strict_types=1);

namespace Server\DAO;

use Server\Models\Client;
use Server\Database\Query\SelectQueryBuilder;
use Server\Database\Connection;

use function Server\Utils\getNullish;

class ClientDAO implements DAO {
    public const TABLE_NAME = "Client";
    public const COLUMNS = [
        "name" => "nume",
        "address" => "adresa",
        "cif" => "cif",
        "workplace" => "punct_lucru",
    ];

    private function __construct() {
    }

    private static function createClient(array $data) {
        return new Client(
            getNullish($data, ClientDAO::COLUMNS["name"]),
            getNullish($data, ClientDAO::COLUMNS["address"]),
            getNullish($data, ClientDAO::COLUMNS["cif"]),
            getNullish($data, ClientDAO::COLUMNS["workplace"]),
        );
    }

    public static function findUnique(Connection $connection, string $name) {
        $col = ClientDAO::COLUMNS["name"];

        $query = (new SelectQueryBuilder())
            ->where("$col = $name")
            ->build(EmployeeDAO::TABLE_NAME);

        $result = $connection->runQuery($query);

        if ($result->num_rows <= 0) {
            return null;
        }

        $row = $result->fetch_assoc();

        return ClientDAO::createClient($row);
    }

    public static function find(Connection $connection, SelectQueryBuilder $builder) {
        $query = $builder->build(ClientDAO::TABLE_NAME);

        $result = $connection->runQuery($query);

        $results = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $results[] = ClientDAO::createClient($row);
            }
        }

        return $results;
    }

    public static function create(Connection $connection, array $data) {
    }

    public function update(Connection $connection) {
    }

    public function delete(Connection $connection) {
    }
}
