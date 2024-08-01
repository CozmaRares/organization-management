<?php

declare(strict_types=1);

namespace Server\DAO;

use Server\Models\Client;
use Server\Database\Connection;
use Server\Database\Query\SelectQueryBuilder;
use Server\Database\Query\InsertQueryBuilder;
use Server\Database\Query\DeleteQueryBuilder;
use Server\Database\Query\UpdateQueryBuilder;

use function Server\Database\Query\_eq;
use function Server\Utils\getNullish;

class ClientDAO implements DAO {
    public const TABLE_NAME = "Client";
    public const COLUMNS = [
        "name" => "nume",
        "address" => "adresa",
        "cif" => "cif",
        "workpoint" => "punct_lucru",
    ];
    public const PK_COL = "name";

    private function __construct() {
    }

    private static function createClient(array $data) {
        return new Client(
            getNullish($data, ClientDAO::COLUMNS["name"]),
            getNullish($data, ClientDAO::COLUMNS["address"]),
            getNullish($data, ClientDAO::COLUMNS["cif"]),
            getNullish($data, ClientDAO::COLUMNS["workpoint"]),
        );
    }

    public static function findUnique(Connection $connection, string $name) {
        $col = ClientDAO::COLUMNS[ClientDAO::PK_COL];

        $query = (new SelectQueryBuilder())
            ->where(_eq("`$col`", "'$name'"))
            ->setTable(ClientDAO::TABLE_NAME)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->num_rows <= 0) {
            return null;
        }

        $row = $result->fetch_assoc();

        return ClientDAO::createClient($row);
    }

    public static function find(Connection $connection, SelectQueryBuilder $builder) {
        $query = $builder
            ->setTable(ClientDAO::TABLE_NAME)
            ->build();

        $result = $connection->runQuery($query);
        $results = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $results[] = ClientDAO::createClient($row);
            }
        }

        return $results;
    }

    public static function create(Connection $connection, array $data): bool {
        $builder = new InsertQueryBuilder();
        foreach ($data as $col => $value) {
            $builder->addCol(ClientDAO::COLUMNS[$col], $value);
        }
        $builder->setTable(ClientDAO::TABLE_NAME);

        $query = $builder->build();

        $res = $connection->runQuery($query);

        if (is_bool($res))
            return $res;

        return true;
    }

    public static function update(Connection $connection, string $uniqueID, array $data): bool {
        $builder = new UpdateQueryBuilder();
        foreach ($data as $col => $value) {
            $builder->addCol(ClientDAO::COLUMNS[$col], $value);
        }

        $query = $builder
            ->setTable(ClientDAO::TABLE_NAME)
            ->setPkCol(ClientDAO::COLUMNS[ClientDAO::PK_COL])
            ->setID($uniqueID)
            ->build();

        $res = $connection->runQuery($query);

        if (is_bool($res))
            return $res;

        return true;
    }

    public static function delete(Connection $connection, string $uniqueID): bool {
        $query = (new DeleteQueryBuilder())
            ->setTable(ClientDAO::TABLE_NAME)
            ->setPkCol(ClientDAO::COLUMNS[ClientDAO::PK_COL])
            ->setID($uniqueID)
            ->build();

        $res = $connection->runQuery($query);

        if (is_bool($res))
            return $res;

        return true;
    }
}
