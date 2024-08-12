<?php

declare(strict_types=1);

namespace Server\DAO;

use Server\Models\Product;
use Server\Database\Connection;
use Server\Database\Query\SelectQueryBuilder;
use Server\Database\Query\InsertQueryBuilder;
use Server\Database\Query\DeleteQueryBuilder;
use Server\Database\Query\UpdateQueryBuilder;

use function Server\Database\Query\_eq;
use function Server\Utils\getNullish;

class ProductDAO implements DAO {
    private const TABLE_NAME = "Produs";
    public const COLUMNS = [
        "name" => "nume",
        "vat" => "tva",
        "stock" => "stoc",
    ];
    private const PK_COL = "name";

    private function __construct() {
    }

    private static function createProduct(array $data) {
        return new Product(
            getNullish($data, ProductDAO::COLUMNS["name"]),
            (int) getNullish($data, ProductDAO::COLUMNS["vat"]),
            (int) getNullish($data, ProductDAO::COLUMNS["stock"]),
        );
    }

    public static function findUnique(Connection $connection, string $id): DAOResult {
        $col = ProductDAO::COLUMNS[ProductDAO::PK_COL];

        $query = (new SelectQueryBuilder())
            ->where(_eq("`$col`", "'$id'"))
            ->setTable(ProductDAO::TABLE_NAME)
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

        return DAOResult::success(ProductDAO::createProduct($row));
    }

    public static function find(Connection $connection, SelectQueryBuilder $builder): DAOResult {
        $query = $builder
            ->setTable(ProductDAO::TABLE_NAME)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success(
            array_map(function ($row) {
                return ProductDAO::createProduct($row);
            }, $result->getRows())
        );
    }

    public static function create(Connection $connection, array $data): DAOResult {
        $builder = new InsertQueryBuilder();
        foreach ($data as $col => $value) {
            $builder->addCol(ClientContractDAO::COLUMNS[$col], "$value");
        }
        $builder->setTable(ProductDAO::TABLE_NAME);

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
            $builder->addCol(ClientContractDAO::COLUMNS[$col], $value);
        }

        $query = $builder
            ->setTable(ProductDAO::TABLE_NAME)
            ->setPkCol(ProductDAO::COLUMNS[ProductDAO::PK_COL])
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
            ->setTable(ProductDAO::TABLE_NAME)
            ->setPkCol(ProductDAO::COLUMNS[ProductDAO::PK_COL])
            ->setID($uniqueID)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success($result);
    }
}
