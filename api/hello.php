<?php

header('Content-Type: application/json');

$data = [
    ['id' => 1, 'name' => 'John Doe'],
    ['id' => 2, 'name' => 'Jane Doe'],
];

echo json_encode($data);
