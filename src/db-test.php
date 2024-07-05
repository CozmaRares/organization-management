<?php

$host = "127.0.0.1";
$username = "root";
$password = "root";
$dbname = "test";
$port = 3306;

$conn = new mysqli($host, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    echo "Connection failed: " . $conn->connect_error;
} else {
    echo "Connection successful";
}

echo "\n";

$conn->close();
