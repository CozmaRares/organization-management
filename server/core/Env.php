<?php

declare(strict_types=1);

namespace Server;

class Env {
    private $env;

    function __construct(string $file) {
        $this->env = __DIR__ . "/../../$file";
        $this->env = parse_ini_file($this->env);
    }

    function get(string $variable) {
        return $this->env[$variable];
    }
}
