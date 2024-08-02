<?php

declare(strict_types=1);

namespace Server\Utils;

function getNullish(array $row, string $col): ?string {
    if (isset($row[$col])) {
        return $row[$col];
    } else {
        return null;
    }
}

function getJSONBody(): array {
    return json_decode(file_get_contents('php://input'), true);
}

function sendJSON(array $data) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
}
