<?php

declare(strict_types=1);

namespace Server\DAO;

use Server\Models\ClientContract;
use Server\Database\Connection;
use Server\Database\Query\SelectQueryBuilder;
use Server\Database\Query\InsertQueryBuilder;
use Server\Database\Query\DeleteQueryBuilder;
use Server\Database\Query\UpdateQueryBuilder;

use function Server\Database\Query\_eq;
use function Server\Utils\getNullish;

class ClientContractDAO implements DAO {
    private const TABLE_NAME = "Contract_Client";
    private const COLUMNS = [
        "id" => "id",
        "clientName" => "nume_client",
        "date" => "data_ef",
        "details" => "detalii",
        "status" => "status",
    ];
    private const PK_COL = "id";

    private function __construct() {
    }

    private static function createContract(array $data) {
        return new ClientContract(
            (int) getNullish($data, ClientContractDAO::COLUMNS["id"]),
            getNullish($data, ClientContractDAO::COLUMNS["clientName"]),
            getNullish($data, ClientContractDAO::COLUMNS["date"]),
            getNullish($data, ClientContractDAO::COLUMNS["details"]),
            getNullish($data, ClientContractDAO::COLUMNS["status"]),
        );
    }

    public static function findUnique(Connection $connection, string $id): DAOResult {
        $col = ClientContractDAO::COLUMNS[ClientContractDAO::PK_COL];

        $query = (new SelectQueryBuilder())
            ->where(_eq("`$col`", "'$id'"))
            ->setTable(ClientContractDAO::TABLE_NAME)
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

        return DAOResult::success(ClientContractDAO::createContract($row));
    }

    public static function find(Connection $connection, SelectQueryBuilder $builder): DAOResult {
        $query = $builder
            ->setTable(ClientContractDAO::TABLE_NAME)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success(
            array_map(function ($row) {
                return ClientContractDAO::createContract($row);
            }, $result->getRows())
        );
    }

    public static function create(Connection $connection, array $data): DAOResult {
        $builder = new InsertQueryBuilder();
        foreach ($data as $col => $value) {
            // TODO: figue out a better way to cast the value to a string
            $builder->addCol(ClientContractDAO::COLUMNS[$col], "$value");
        }
        $builder->setTable(ClientContractDAO::TABLE_NAME);

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
            $builder->addCol(ClientContractDAO::COLUMNS[$col], "$value");
        }

        $query = $builder
            ->setTable(ClientContractDAO::TABLE_NAME)
            ->setPkCol(ClientContractDAO::COLUMNS[ClientContractDAO::PK_COL])
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
            ->setTable(ClientContractDAO::TABLE_NAME)
            ->setPkCol(ClientContractDAO::COLUMNS[ClientContractDAO::PK_COL])
            ->setID($uniqueID)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success($result);
    }
}
