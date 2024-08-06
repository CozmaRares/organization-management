<?php

namespace Server\Models;

class Client {
    private $name;
    private $address;
    private $cif;
    private $workpoint;

    public function __construct(
        ?string $name,
        ?string $address,
        ?string $cif,
        ?string $workpoint,
    ) {
        $this->name = $name;
        $this->address = $address;
        $this->cif = $cif;
        $this->workpoint = $workpoint;
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

    public function getWorkpoint(): string {
        return $this->workpoint;
    }
}

// TODO: script to generate model and DAO
