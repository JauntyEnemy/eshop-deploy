<?php

namespace App\Models;

class Product
{
    private $db;

    public function __construct(\PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Get all products
     */
    public function getAll(array $filters = []): array
    {
        $sql = "SELECT * FROM products WHERE 1=1";
        $params = [];

        if (!empty($filters['category'])) {
            $sql .= " AND category = :category";
            $params[':category'] = $filters['category'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (name LIKE :search OR description LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        if (isset($filters['in_stock']) && $filters['in_stock']) {
            $sql .= " AND stock > 0";
        }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    /**
     * Get product by ID
     */
    public function getById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);

        $product = $stmt->fetch();
        return $product ?: null;
    }

    /**
     * Create new product
     */
    public function create(array $data): int
    {
        $sql = "INSERT INTO products (name, description, price, category, stock, image_url, created_at, updated_at) 
                VALUES (:name, :description, :price, :category, :stock, :image_url, NOW(), NOW())";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name' => $data['name'],
            ':description' => $data['description'] ?? null,
            ':price' => $data['price'],
            ':category' => $data['category'] ?? null,
            ':stock' => $data['stock'] ?? 0,
            ':image_url' => $data['image_url'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Update product
     */
    public function update(int $id, array $data): bool
    {
        // Build dynamic SQL and params based on provided fields
        $updates = [];
        $params = [':id' => $id];

        if (isset($data['name'])) {
            $updates[] = "name = :name";
            $params[':name'] = $data['name'];
        }
        if (isset($data['description'])) {
            $updates[] = "description = :description";
            $params[':description'] = $data['description'];
        }
        if (isset($data['price'])) {
            $updates[] = "price = :price";
            $params[':price'] = $data['price'];
        }
        if (isset($data['category'])) {
            $updates[] = "category = :category";
            $params[':category'] = $data['category'];
        }
        if (isset($data['stock'])) {
            $updates[] = "stock = :stock";
            $params[':stock'] = $data['stock'];
        }
        if (isset($data['image_url'])) {
            $updates[] = "image_url = :image_url";
            $params[':image_url'] = $data['image_url'];
        }

        if (empty($updates)) {
            return true; // Nothing to update
        }

        $updates[] = "updated_at = NOW()";
        $sql = "UPDATE products SET " . implode(", ", $updates) . " WHERE id = :id";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    /**
     * Delete product
     */
    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM products WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    /**
     * Update stock
     */
    public function updateStock(int $id, int $quantity): bool
    {
        $stmt = $this->db->prepare("UPDATE products SET stock = stock + :quantity WHERE id = :id");
        return $stmt->execute([':id' => $id, ':quantity' => $quantity]);
    }
}
