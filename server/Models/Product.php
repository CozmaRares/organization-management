<?php

namespace Server\Models;

class Product {
    private $name;
    private $vat;
    private $stock;

    public function __construct(
        ?string $name,
        ?int $vat,
        ?int $stock,
    ) {
        $this->name = $name;
        $this->vat = $vat;
        $this->stock = $stock;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getVat(): string {
        return $this->vat;
    }

    public function getStock(): string {
        return $this->stock;
    }

    public function getJSON(): array {
        return [
            "name" => $this->name,
            "vat" => $this->vat,
            "stock" => $this->stock,
        ];
    }
}
