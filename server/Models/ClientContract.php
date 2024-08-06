<?php

namespace Server\Models;

class ClientContract {
    private $id;
    private $clientName;
    private $license;
    private $quantity;
    private $price;
    private $type;
    private $date;
    private $details;
    private $status;

    public function __construct(
        ?int $id,
        ?string $clientName,
        ?string $license,
        ?int $quantity,
        ?float $price,
        ?string $type,
        ?string $date,
        ?string $details,
        ?string $status,
    ) {
        $this->id = $id;
        $this->clientName = $clientName;
        $this->license = $license;
        $this->quantity = $quantity;
        $this->price = $price;
        $this->type = $type;
        $this->date = $date;
        $this->details = $details;
        $this->status = $status;
    }

    public function getID(): ?int {
        return $this->id;
    }

    public function getClientName(): ?string {
        return $this->clientName;
    }

    public function getLicense(): ?string {
        return $this->license;
    }

    public function getQuantity(): ?int {
        return $this->quantity;
    }

    public function getPrice(): ?float {
        return $this->price;
    }

    public function getType(): ?string {
        return $this->type;
    }

    public function getDate(): ?string {
        return $this->date;
    }

    public function getDetails(): ?string {
        return $this->details;
    }

    public function getStatus(): ?string {
        return $this->status;
    }

    public function getJSON(): array {
        return [
            "id" => $this->id,
            "clientName" => $this->clientName,
            "license" => $this->license,
            "quantity" => $this->quantity,
            "price" => $this->price,
            "type" => $this->type,
            "date" => $this->date,
            "details" => $this->details,
            "status" => $this->status,
        ];
    }
}
