<?php

namespace Server\Database\Query;

class UpdateQueryBuilder {
    private $pkCol;
    private $id;
    private $data;
    private $tableName;


    public function __construct() {
        $this->pkCol = null;
        $this->id = null;
        $this->tableName = null;
    }

    public function setTable(string $tableName) {
        $this->tableName = $tableName;
        return $this;
    }

    public function setPkCol(string $col) {
        $this->pkCol = $col;
        return $this;
    }

    public function addCol(string $col, string $value) {
        $this->data[$col] = $value;
        return $this;
    }

    public function setID(string $id) {
        $this->id = $id;
        return $this;
    }

    public function build() {
        $formatted = [];
        foreach ($this->data as $col => $value) {
            $formatted []= "`$col` = '$value'";
        }
        $set = implode(", ", $formatted);
        return "UPDATE `$this->tableName` SET $set WHERE `$this->pkCol` = '$this->id';";
    }
}
