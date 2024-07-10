<?php

namespace Server\Database\Query;

class SelectQueryBuilder {
    private $cols;
    private $where;
    private $orderBy;
    private $limit;
    private $offset;

    public function __construct() {
        $this->cols = [];
        $this->where = null;
        $this->orderBy = [];
        $this->limit = null;
        $this->offset = null;
    }

    public function addCol(string $col) {
        $this->cols[] = $col;
        return $this;
    }

    public function where(string $where) {
        $this->where = $where;
        return $this;
    }

    public function orderBy(string $col, bool $desc = false) {
        $ord = "$col";

        if ($desc)
            $ord .= " desc";

        $this->orderBy[] = $ord;

        return $this;
    }

    public function limit(int $limit) {
        $this->limit = $limit;
        return $this;
    }

    public function offset(int $offset) {
        $this->offset = $offset;
        return $this;
    }

    public function build(string $tableName) {
        $query = "select " . (count($this->cols) == 0 ? "*" : join(", ", $this->cols)) . " from $tableName";

        if ($this->where !== null) {
            $query .= " where $this->where";
        }

        if (count($this->orderBy) > 0) {
            $query .= " order by " . join(", ", $this->orderBy);
        }

        if ($this->limit !== null) {
            $query .= " limit $this->limit";
        }

        if ($this->offset !== null) {
            $query .= " offset $this->offset";
        }

        $query .= ";";

        return $query;
    }
}
