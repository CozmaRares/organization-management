<?php

declare(strict_types=1);

namespace Server\DAO;

use Server\Models\Supplier;
use Server\Database\Connection;
use Server\Database\Query\SelectQueryBuilder;
use Server\Database\Query\InsertQueryBuilder;
use Server\Database\Query\DeleteQueryBuilder;
use Server\Database\Query\UpdateQueryBuilder;

use function Server\Database\Query\_eq;
use function Server\Utils\getNullish;

class SupplierDAO implements DAO {
    private const TABLE_NAME = "Furnizor";
    private const COLUMNS = [
        "name" => "nume",
        "status" => "status",
    ];
    private const PK_COL = "name";

    private function __construct() {
    }

    private static function createSupplier(array $data) {
        return new Supplier(
            getNullish($data, SupplierDAO::COLUMNS["name"]),
            getNullish($data, SupplierDAO::COLUMNS["status"]),
        );
    }

    public static function findUnique(Connection $connection, string $id): DAOResult {
        $col = SupplierDAO::COLUMNS[SupplierDAO::PK_COL];

        $query = (new SelectQueryBuilder())
            ->where(_eq("`$col`", "'$id'"))
            ->setTable(SupplierDAO::TABLE_NAME)
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

        return DAOResult::success(SupplierDAO::createSupplier($row));
    }

    public static function find(Connection $connection, SelectQueryBuilder $builder): DAOResult {
        $query = $builder
            ->setTable(SupplierDAO::TABLE_NAME)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success(
            array_map(function ($row) {
                return SupplierDAO::createSupplier($row);
            }, $result->getRows())
        );
    }

    public static function create(Connection $connection, array $data): DAOResult {
        $builder = new InsertQueryBuilder();
        foreach ($data as $col => $value) {
            $builder->addCol(SupplierDAO::COLUMNS[$col], "$value");
        }
        $builder->setTable(SupplierDAO::TABLE_NAME);

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
            $builder->addCol(SupplierDAO::COLUMNS[$col], "$value");
        }

        $query = $builder
            ->setTable(SupplierDAO::TABLE_NAME)
            ->setPkCol(SupplierDAO::COLUMNS[SupplierDAO::PK_COL])
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
            ->setTable(SupplierDAO::TABLE_NAME)
            ->setPkCol(SupplierDAO::COLUMNS[SupplierDAO::PK_COL])
            ->setID($uniqueID)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success($result);
    }
}
