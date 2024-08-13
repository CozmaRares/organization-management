<?php

declare(strict_types=1);

namespace Server\DAO;

use Server\Models\SupplierBill;
use Server\Database\Connection;
use Server\Database\Query\SelectQueryBuilder;
use Server\Database\Query\InsertQueryBuilder;
use Server\Database\Query\DeleteQueryBuilder;
use Server\Database\Query\UpdateQueryBuilder;

use function Server\Database\Query\_eq;
use function Server\Utils\getNullish;

class SupplierBillDAO implements DAO {
    private const TABLE_NAME = "Factura_Furnizor";
    private const COLUMNS = [
        "id" => "id",
        "supplierName" => "nume_furnizor",
        "issuedDate" => "data_emisa",
        "dueDate" => "data_scadenta",
        "total" => "total",
        "paid" => "platit",
    ];
    private const PK_COL = "id";

    private function __construct() {
    }

    private static function createSupplierBill(array $data) {
        return new SupplierBill(
            (int) getNullish($data, SupplierBillDAO::COLUMNS["id"]),
            getNullish($data, SupplierBillDAO::COLUMNS["supplierName"]),
            getNullish($data, SupplierBillDAO::COLUMNS["issuedDate"]),
            getNullish($data, SupplierBillDAO::COLUMNS["dueDate"]),
            (float) getNullish($data, SupplierBillDAO::COLUMNS["total"]),
            (float) getNullish($data, SupplierBillDAO::COLUMNS["paid"]),
        );
    }

    public static function findUnique(Connection $connection, string $id): DAOResult {
        $col = SupplierBillDAO::COLUMNS[SupplierBillDAO::PK_COL];

        $query = (new SelectQueryBuilder())
            ->where(_eq("`$col`", "'$id'"))
            ->setTable(SupplierBillDAO::TABLE_NAME)
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

        return DAOResult::success(SupplierBillDAO::createSupplierBill($row));
    }

    public static function find(Connection $connection, SelectQueryBuilder $builder): DAOResult {
        $query = $builder
            ->setTable(SupplierBillDAO::TABLE_NAME)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success(
            array_map(function ($row) {
                return SupplierBillDAO::createSupplierBill($row);
            }, $result->getRows())
        );
    }

    public static function create(Connection $connection, array $data): DAOResult {
        $builder = new InsertQueryBuilder();
        foreach ($data as $col => $value) {
            $builder->addCol(SupplierBillDAO::COLUMNS[$col], "$value");
        }
        $builder->setTable(SupplierBillDAO::TABLE_NAME);

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
            $builder->addCol(SupplierBillDAO::COLUMNS[$col], "$value");
        }

        $query = $builder
            ->setTable(SupplierBillDAO::TABLE_NAME)
            ->setPkCol(SupplierBillDAO::COLUMNS[SupplierBillDAO::PK_COL])
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
            ->setTable(SupplierBillDAO::TABLE_NAME)
            ->setPkCol(SupplierBillDAO::COLUMNS[SupplierBillDAO::PK_COL])
            ->setID($uniqueID)
            ->build();

        $result = $connection->runQuery($query);

        if ($result->isError()) {
            return DAOResult::error($result->getError());
        }

        return DAOResult::success($result);
    }
}
