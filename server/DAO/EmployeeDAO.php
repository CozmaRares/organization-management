<?php

declare(strict_types=1);

namespace Server\DAO;

use Server\Models\Employee;
use Server\Database\Query\SelectQueryBuilder;

use mysqli;

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

    public static function findByID(mysqli $connection, string $id) {
        $col = EmployeeDAO::COLUMNS['id'];

        $query = (new SelectQueryBuilder())
            ->where("$col = $id")
            ->build(EmployeeDAO::TABLE_NAME);

        $result = $connection->query($query);

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

    public static function find(mysqli $connection, SelectQueryBuilder $builder) {
        $query = $builder->build(EmployeeDAO::TABLE_NAME);

        $result = $connection->query($query);

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

    public static function create(mysqli $connection, array $data) {
    }

    public function update(mysqli $connection) {
    }

    public function delete(mysqli $connection) {
    }
}
