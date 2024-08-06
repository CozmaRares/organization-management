<?php

namespace Server\DAO;

use Server\Database\Connection;
use Server\Database\Query\SelectQueryBuilder;

interface DAO {
    public static function findUnique(Connection $connection, string $uniqueID): DAOResult;
    public static function find(Connection $connection, SelectQueryBuilder $builder): DAOResult;

    public static function create(Connection $connection, array $data): DAOResult;

    public static function update(Connection $connection, string $uniqueID, array $data): DAOResult;

    public static function delete(Connection $connection, string $uniqueID): DAOResult;
}

class DAOResult {
    private bool $status;
    private $data;

    private function __construct(bool $status, $data) {
        $this->status = $status;
        $this->data = $data;
    }

    public static function success($data) {
        return new DAOResult(true, $data);
    }

    public static function error(string $data) {
        return new DAOResult(false, $data);
    }

    public function isSuccess() {
        return $this->status;
    }

    public function isError() {
        return !$this->isSuccess();
    }

    public function getData() {
        if ($this->isError())
            return null;

        return $this->data;
    }

    public function getError() {
        if ($this->isSuccess())
            return null;

        return $this->data;
    }
}
