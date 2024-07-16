<?php

declare(strict_types=1);

namespace Server\DAO;

use Server\Models\Employee;
use Server\Database\Query\SelectQueryBuilder;
use Server\Database\Connection;

use function Server\Utils\getNullish;

class EmployeeDAO implements DAO {
    public const TABLE_NAME = "Employees";
    public const COLUMNS = [
        "id" => "ID",
        "name" => "Name",
        "position" => "Position",
        "salary" => "Salary",
    ];

    private function __construct() {
    }

    private static function createEmployee(array $data) {
        return new Employee(
            getNullish($data, EmployeeDAO::COLUMNS["id"]),
            getNullish($data, EmployeeDAO::COLUMNS["name"]),
            getNullish($data, EmployeeDAO::COLUMNS["position"]),
            (float) getNullish($data, EmployeeDAO::COLUMNS["salary"]),
        );
    }

    public static function findByID(Connection $connection, string $id) {
        $col = EmployeeDAO::COLUMNS['id'];

        $query = (new SelectQueryBuilder())
            ->where("$col = $id")
            ->build(EmployeeDAO::TABLE_NAME);

        $result = $connection->runQuery($query);

        if ($result->num_rows <= 0) {
            return null;
        }

        $row = $result->fetch_assoc();

        return EmployeeDAO::createEmployee($row);
    }

    public static function find(Connection $connection, SelectQueryBuilder $builder) {
        $query = $builder->build(EmployeeDAO::TABLE_NAME);

        $result = $connection->runQuery($query);

        $results = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $results[] = EmployeeDAO::createEmployee($row);
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
