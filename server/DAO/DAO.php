<?php

namespace Server\DAO;

use Server\Database\Connection;
use Server\Database\Query\SelectQueryBuilder;

interface DAO {
    public static function findUnique(Connection $connection, string $id);
    public static function find(Connection $connection, SelectQueryBuilder $builder);

    public static function create(Connection $connection, array $data);

    public function update(Connection $connection);

    public function delete(Connection $connection);
}
