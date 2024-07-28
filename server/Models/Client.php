<?php

namespace Server\Models;

class Client {
    private $name;
    private $address;
    private $cif;
    private $workplace;

    public function __construct(
        ?string $name,
        ?string $address,
        ?string $cif,
        ?string $workplace,
    ) {
        $this->name = $name;
        $this->address = $address;
        $this->cif = $cif;
        $this->workplace = $workplace;
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


    public function getWorkplace(): string {
        return $this->workplace;
    }

    public function setWorkplace(string $workplace): void {
        $this->workplace = $workplace;
    }
}

// TODO: script to generate model and DAO
