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