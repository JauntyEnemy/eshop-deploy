<?php

namespace App\Models;

class DeliveryZone
{
    private $db;

    public function __construct(\PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Get all delivery zones
     */
    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM delivery_zones ORDER BY name ASC");
        return $stmt->fetchAll();
    }

    /**
     * Get delivery zone by ID
     */
    public function getById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM delivery_zones WHERE id = :id");
        $stmt->execute([':id' => $id]);

        $zone = $stmt->fetch();
        return $zone ?: null;
    }

    /**
     * Create new delivery zone
     */
    public function create(array $data): int
    {
        $sql = "INSERT INTO delivery_zones (name, fee, estimated_time, created_at, updated_at) 
                VALUES (:name, :fee, :estimated_time, NOW(), NOW())";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name' => $data['name'],
            ':fee' => $data['fee'],
            ':estimated_time' => $data['estimated_time'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Update delivery zone
     */
    public function update(int $id, array $data): bool
    {
        $sql = "UPDATE delivery_zones SET 
                name = :name, 
                fee = :fee, 
                estimated_time = :estimated_time,
                updated_at = NOW()
                WHERE id = :id";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':name' => $data['name'],
            ':fee' => $data['fee'],
            ':estimated_time' => $data['estimated_time'] ?? null,
        ]);
    }

    /**
     * Delete delivery zone
     */
    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM delivery_zones WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
