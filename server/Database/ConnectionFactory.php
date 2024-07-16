<?php

declare(strict_types=1);

namespace Server\Database;

use mysqli;
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
    public function runQuery(string $query) {
        Logger::info("Running query: $query");

        return $this->query($query);
    }
}
