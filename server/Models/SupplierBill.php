<?php

namespace Server\Models;

class SupplierBill {
    private $id;
    private $supplierName;
    private $issuedDate;
    private $dueDate;
    private $total;
    private $paid;

    public function __construct(
        ?int $id,
        ?string $supplierName,
        ?string $issuedDate,
        ?string $dueDate,
        ?float $total,
        ?float $paid,
    ) {
        $this->id = $id;
        $this->supplierName = $supplierName;
        $this->issuedDate = $issuedDate;
        $this->dueDate = $dueDate;
        $this->total = $total;
        $this->paid = $paid;
    }

    public function getId() {
        return $this->id;
    }
    public function getSupplierName() {
        return $this->supplierName;
    }
    public function getIssuedDate() {
        return $this->issuedDate;
    }
    public function getDueDate() {
        return $this->dueDate;
    }
    public function getTotal() {
        return $this->total;
    }
    public function getPaid() {
        return $this->paid;
    }

    public function getJSON(): array {
        return [
            "id" => $this->id,
            "supplierName" => $this->supplierName,
            "issuedDate" => $this->issuedDate,
            "dueDate" => $this->dueDate,
            "status" => $this->status,
            "total" => $this->total,
            "paid" => $this->paid,
        ];
    }
}
