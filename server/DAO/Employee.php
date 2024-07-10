<?php

declare(strict_types=1);

namespace Server\DAO;

use mysqli;

class Employee implements DAO {
    private const TABLE_NAME = "Employees";
    private const COLUMNS = [
        "id" => "ID",
        "name" => "Name",
        "position" => "Position",
        "salary" => "Salary",
    ];

    private $id;
    private $name;
    private $position;
    private $salary;

    private function __construct(
        string $id,
        string $name,
        string $position,
        float $salary
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->position = $position;
        $this->salary = $salary;
    }

    public static function findByID(mysqli $connection, string $id) {
        $col = Employee::COLUMNS['id'];
        $query = "select * from " . Employee::TABLE_NAME . " where $col = $id;";

        $result = $connection->query($query);

        if ($result->num_rows <= 0) {
            return null;
        }

        $row = $result->fetch_assoc();

        return new Employee(
            $row[Employee::COLUMNS["id"]],
            $row[Employee::COLUMNS["name"]],
            $row[Employee::COLUMNS["position"]],
            (float) $row[Employee::COLUMNS["salary"]],
        );
    }

    public static function find(mysqli $connection, string $where) {
    }

    public static function create(mysqli $connection, array $data) {
    }

    public function update(mysqli $connection) {
    }

    public function delete(mysqli $connection) {
    }

    public function getName(): string {
        return $this->name;
    }

    public function setName(string $name): void {
        $this->name = $name;
    }

    public function getPosition(): string {
        return $this->position;
    }

    public function setPosition(string $position): void {
        $this->position = $position;
    }

    public function getSalary(): float {
        return $this->salary;
    }

    public function setSalary(float $salary): void {
        if ($salary < 0) {
            throw new \InvalidArgumentException('Salary cannot be negative.');
        }
        $this->salary = $salary;
    }
}
