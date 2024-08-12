<?php

namespace Server\Models;

class Supplier {
    private $name;
    private $status;

    public function __construct(
        ?string $name,
        ?string  $status,
    ) {
        $this->name = $name;
        $this->status = $status;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getStatus(): string {
        return $this->status;
    }

    public function getJSON(): array {
        return [
            "name" => $this->name,
            "status" => $this->status,
        ];
    }
}
