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
    private const TABLE_NAME = "Client";
    public const COLUMNS = [
        "name" => "nume",
        "address" => "adresa",
        "cif" => "cif",
    ];
    private const PK_COL = "name";

    private function __construct() {
    }

    private static function createClient(array $data) {
        return new Client(
            getNullish($data, ClientDAO::COLUMNS["name"]),
            getNullish($data, ClientDAO::COLUMNS["address"]),
            getNullish($data, ClientDAO::COLUMNS["cif"]),
        );
    }

    public static function findUnique(Connection $connection, string $name): DAOResult {
        $col = ClientDAO::COLUMNS[ClientDAO::PK_COL];

        $query = (new SelectQueryBuilder())
            ->where(_eq("`$col`", "'$name'"))
            ->setTable(ClientDAO::TABLE_NAME)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        $result = $result->getRows();

        if (count($result) <= 0) {
            return DAOResult::success(null);
        }

        $row = $result[0];

        return DAOResult::success(ClientDAO::createClient($row));
    }

    public static function find(Connection $connection, SelectQueryBuilder $builder): DAOResult {
        $query = $builder
            ->setTable(ClientDAO::TABLE_NAME)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success(
            array_map(function ($row) {
                return ClientDAO::createClient($row);
            }, $result->getRows())
        );
    }

    public static function create(Connection $connection, array $data): DAOResult {
        $builder = new InsertQueryBuilder();
        foreach ($data as $col => $value) {
            $builder->addCol(ClientDAO::COLUMNS[$col], $value);
        }
        $builder->setTable(ClientDAO::TABLE_NAME);

        $query = $builder->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success($result);
    }

    public static function update(Connection $connection, string $uniqueID, array $data): DAOResult {
        $builder = new UpdateQueryBuilder();
        foreach ($data as $col => $value) {
            $builder->addCol(ClientDAO::COLUMNS[$col], $value);
        }

        $query = $builder
            ->setTable(ClientDAO::TABLE_NAME)
            ->setPkCol(ClientDAO::COLUMNS[ClientDAO::PK_COL])
            ->setID($uniqueID)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success($result);
    }

    public static function delete(Connection $connection, string $uniqueID): DAOResult {
        $query = (new DeleteQueryBuilder())
            ->setTable(ClientDAO::TABLE_NAME)
            ->setPkCol(ClientDAO::COLUMNS[ClientDAO::PK_COL])
            ->setID($uniqueID)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success($result);
    }
}
