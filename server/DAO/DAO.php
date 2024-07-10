<?php

namespace Server\DAO;

use mysqli;

interface DAO {
    public static function findByID(mysqli $connection, string $id);
    public static function find(mysqli $connection, string $where);

    public static function create(mysqli $connection, array $data);

    public function update(mysqli $connection);

    public function delete(mysqli $connection);
}
