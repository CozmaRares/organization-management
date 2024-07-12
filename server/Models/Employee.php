<?php

namespace Server\Models;

class Employee {
    private $id;
    private $name;
    private $position;
    private $salary;

    public function __construct(
        ?string $id,
        ?string $name,
        ?string $position,
        ?float $salary
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->position = $position;
        $this->salary = $salary;
    }

    public function getID(): string {
        return $this->id;
    }

    public function getName(): string {
        return $this->name;
    }

    public function setName(string $name): void {
        $this->name = $name;
    }

    public function getPosition(): string {
        return $this->position;
    }

    public function setPosition(string $position): void {
        $this->position = $position;
    }

    public function getSalary(): float {
        return $this->salary;
    }

    public function setSalary(float $salary): void {
        if ($salary < 0) {
            throw new \InvalidArgumentException('Salary cannot be negative.');
        }
        $this->salary = $salary;
    }
}
