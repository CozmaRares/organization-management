<?php

declare(strict_types=1);

namespace Server\DAO;

use Server\Models\Employee;
use Server\Database\Query\SelectQueryBuilder;

use Server\Database\Connection;

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

        return new Employee(
            $row[EmployeeDAO::COLUMNS["id"]],
            $row[EmployeeDAO::COLUMNS["name"]],
            $row[EmployeeDAO::COLUMNS["position"]],
            (float) $row[EmployeeDAO::COLUMNS["salary"]],
        );
    }

    public static function find(Connection $connection, SelectQueryBuilder $builder) {
        $query = $builder->build(EmployeeDAO::TABLE_NAME);

        $result = $connection->runQuery($query);

        $results = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $results[] = new Employee(
                    $row[EmployeeDAO::COLUMNS["id"]],
                    $row[EmployeeDAO::COLUMNS["name"]],
                    $row[EmployeeDAO::COLUMNS["position"]],
                    (float) $row[EmployeeDAO::COLUMNS["salary"]],
                );
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
