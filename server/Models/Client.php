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

    public function setName(string $name): void {
        $this->name = $name;
    }

    public function getAddress(): string {
        return $this->address;
    }

    public function setAddress(string $address): void {
        $this->address = $address;
    }

    public function getCIF(): string {
        return $this->cif;
    }

    public function setCIF(string $cif): void {
        $this->cif = $cif;
    }


    public function getWorkpoint(): string {
        return $this->workpoint;
    }

    public function setWorkpoint(string $workpoint): void {
        $this->workpoint = $workpoint;
    }
}

// TODO: script to generate model and DAO
