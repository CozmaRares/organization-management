<?php

declare(strict_types=1);

namespace Server\Database;

use mysqli;
use mysqli_result;
use Server\Env;
use Server\Logger;

const ENV_FILE = ".env";

class ConnectionFactory {
    private function __construct() {
    }

    public static function newConnection(): Connection {
        $env = new Env(ENV_FILE);

        $host = $env->get("MYSQL_HOST");
        $username = "root";
        $password = $env->get("MYSQL_ROOT_PASSWORD");
        $dbname = $env->get("MYSQL_DATABASE");
        $port = (int) $env->get("MYSQL_PORT");

        $connection = new Connection($host, $username, $password, $dbname, $port);

        if ($connection->connect_error) {
            die("Connection failed: " . $connection->connect_error);
        }

        return $connection;
    }
}

class Connection extends mysqli {
    public function runQuery(string $query): QueryResult {
        Logger::info("Running query: $query");

        try {
            $result = $this->query($query);
        } catch (\mysqli_sql_exception $e) {
            Logger::error("Query failed: " . $e->getMessage());
            return QueryResult::error($e->getMessage());
        }

        if (is_bool($result)) {
            return QueryResult::boolean($result);
        }

        return QueryResult::set($result);
    }
}

enum ResultType {
    case SET;
    case ERROR;
    case BOOLEAN;
};

class QueryResult {
    private ResultType $type;
    private $content;

    private function __construct($type, $content) {
        $this->type = $type;
        $this->content = $content;
    }

    public static function set(mysqli_result $result) {
        return new QueryResult(ResultType::SET, $result->fetch_all(MYSQLI_ASSOC));
    }

    public static function boolean(bool $result) {
        return new QueryResult(ResultType::BOOLEAN, $result);
    }

    public static function error(string $message) {
        return new QueryResult(ResultType::ERROR, $message);
    }

    public function isError(): bool {
        return $this->type === ResultType::ERROR;
    }

    public function isSuccess(): bool {
        return !$this->isError() &&
            ($this->type !== ResultType::BOOLEAN || $this->content !== false);
    }

    public function getRows(): array {
        if ($this->type != ResultType::SET)
            return [];

        return $this->content;
    }

    public function getError(): string {
        if ($this->type != ResultType::ERROR)
            return "";

        return $this->content;
    }
}
