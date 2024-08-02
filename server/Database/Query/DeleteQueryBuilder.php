<?php

namespace Server\Database\Query;

class DeleteQueryBuilder {
    private $pkCol;
    private $id;
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

    public function setID(string $id) {
        $this->id = $id;
        return $this;
    }

    public function build() {
        return " DELETE FROM `$this->tableName` WHERE `$this->pkCol` = '$this->id';";
    }
}
