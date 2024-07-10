<?php

require "bootstrap.php";

use Server\Env;

$env = new Env(".env.local");

$host = $env->get("MYSQL_HOST");
$username = "root";
$password = $env->get("MYSQL_ROOT_PASSWORD");
$dbname = $env->get("MYSQL_DATABASE");
$port = $env->get("MYSQL_PORT");

$conn = new mysqli($host, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Connection successful";
}

$conn->close();

echo "\n";
