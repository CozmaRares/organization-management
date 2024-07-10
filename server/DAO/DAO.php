<?php

namespace Server\DAO;

use Server\Database\Query\SelectQueryBuilder;

use mysqli;

interface DAO {
    public static function findByID(mysqli $connection, string $id);
    public static function find(mysqli $connection, SelectQueryBuilder $builder);

    public static function create(mysqli $connection, array $data);

    public function update(mysqli $connection);

    public function delete(mysqli $connection);
}
