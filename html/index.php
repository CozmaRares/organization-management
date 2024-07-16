<?php

require "../server/bootstrap.php";

use Server\DAO\EmployeeDAO;
use Server\Database\ConnectionFactory;
use Server\Database\Query\SelectQueryBuilder;

use function Server\Database\Query\_and;
use function Server\Database\Query\_eq;

$conn = ConnectionFactory::newConnection();

$builder = (new SelectQueryBuilder())
    ->addCol(EmployeeDAO::COLUMNS["name"])
    ->addCol(EmployeeDAO::COLUMNS["salary"])
    ->where(
        _and(
            _eq(EmployeeDAO::COLUMNS["id"], "1"),
            _eq(EmployeeDAO::COLUMNS["salary"], "75000"),
        )
    );

$e = EmployeeDAO::find($conn, $builder);

foreach ($e as  $emp) {
    echo "Name: " . $emp->getName();
    /*echo "\nPosition: " . $emp->getPosition();*/
    echo "\nSalary: " . $emp->getSalary();
    echo "\n";
}

$conn->close();
