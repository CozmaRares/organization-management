<?php

namespace Server\Models;

class Client {
    private $name;
    private $address;
    private $cif;

    public function __construct(
        ?string $name,
        ?string $address,
        ?string $cif,
    ) {
        $this->name = $name;
        $this->address = $address;
        $this->cif = $cif;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getAddress(): string {
        return $this->address;
    }

    public function getCIF(): string {
        return $this->cif;
    }

    public function getJSON(): array {
        return [
            "name" => $this->name,
            "address" => $this->address,
            "cif" => $this->cif,
        ];
    }
}
