<?php

declare(strict_types=1);

namespace Server\Database\Query;

// LOGICAL ==============

function _and(string ...$cols): string {
    return join(" and ", $cols);
}

function _or(string ...$cols): string {
    return join(" or ", $cols);
}

function _not(string $col): string {
    return "not ($col)";
}

// COMPARISON ==============

function _eq(string $left, string $right): string {
    return "$left = $right";
}

function _neq(string $left, string $right): string {
    return "$left <> $right";
}

function _le(string $left, string $right): string {
    return "$left < $right";
}

function _lee(string $left, string $right): string {
    return "$left <= $right";
}

function _gt(string $left, string $right): string {
    return "$left > $right";
}

function _gte(string $left, string $right): string {
    return "$left >= $right";
}

function _null(string $col): string {
    return "$col is null";
}

function _nnull(string $col): string {
    return "$col is not null";
}

// OTHER ==============

function _in(string $col, string ...$values): string {
    $expr = "$col in (";

    foreach ($values as $idx => $val) {
        if ($idx != 0) {
            $expr .= ", ";
        }

        $expr .=  $val;
    }

    $expr .= " )";

    return $expr;
}

function _between(string $col, string $low, string $high): string {
    return "$col between $low and $high";
}

function _like(string $col, string $pattern): string {
    return "$col like $pattern";
}
