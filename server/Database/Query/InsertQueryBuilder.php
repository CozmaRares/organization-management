<?php

namespace Server\Database\Query;

class InsertQueryBuilder {
    private $data;
    private $tableName;

    public function __construct() {
        $this->data = [];
        $this->tableName = null;
    }

    public function setTable(string $tableName) {
        $this->tableName = $tableName;
        return $this;
    }

    public function addCol(string $col, string $value) {
        $this->data[$col] = $value;
        return $this;
    }

    public function build() {
        $cols = array_keys($this->data);
        $cols = array_map(
            function ($col) {
                return "`$col`";
            },
            $cols
        );
        $cols = implode(', ', $cols);

        $values = array_values($this->data);
        $values = array_map(
            function ($val) {
                return "'$val'";
            },
            $values
        );
        $values = implode(', ', $values);

        return "INSERT INTO `$this->tableName` ($cols) VALUES ($values);";
    }
}
