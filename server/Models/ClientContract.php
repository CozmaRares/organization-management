<?php

namespace Server\Models;

class ClientContract {
    private $id;
    private $clientName;
    private $date;
    private $details;
    private $status;

    public function __construct(
        ?int $id,
        ?string $clientName,
        ?string $date,
        ?string $details,
        ?string $status,
    ) {
        $this->id = $id;
        $this->clientName = $clientName;
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
            "date" => $this->date,
            "details" => $this->details,
            "status" => $this->status,
        ];
    }
}
