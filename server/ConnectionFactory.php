<?php

declare(strict_types=1);

namespace Server;

use mysqli;

const ENV_FILE = ".env.local";

class ConnectionFactory {
    private function __construct() {
    }

    public static function newConnection(): mysqli {
        $env = new Env(ENV_FILE);

        $host = $env->get("MYSQL_HOST");
        $username = "root";
        $password = $env->get("MYSQL_ROOT_PASSWORD");
        $dbname = $env->get("MYSQL_DATABASE");
        $port = (int) $env->get("MYSQL_PORT");

        $connection = new mysqli($host, $username, $password, $dbname, $port);

        if ($connection->connect_error) {
            die("Connection failed: " . $connection->connect_error);
        }

        return $connection;
    }
}
