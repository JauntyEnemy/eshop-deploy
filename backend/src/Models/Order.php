<?php

namespace App\Models;

class Order
{
    private $db;

    public function __construct(\PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Get all orders
     */
    public function getAll(array $filters = []): array
    {
        $sql = "SELECT * FROM orders WHERE 1=1";
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= " AND status = :status";
            $params[':status'] = $filters['status'];
        }

        if (!empty($filters['customer_phone'])) {
            $sql .= " AND customer_phone = :customer_phone";
            $params[':customer_phone'] = $filters['customer_phone'];
        }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    /**
     * Get order by ID with items
     */
    public function getById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM orders WHERE id = :id");
        $stmt->execute([':id' => $id]);

        $order = $stmt->fetch();
        if (!$order) {
            return null;
        }

        // Get order items
        $stmt = $this->db->prepare("
            SELECT oi.*, p.name as product_name, p.image_url 
            FROM order_items oi 
            LEFT JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = :order_id
        ");
        $stmt->execute([':order_id' => $id]);
        $order['items'] = $stmt->fetchAll();

        return $order;
    }

    /**
     * Create new order
     */
    public function create(array $data): int
    {
        $this->db->beginTransaction();

        try {
            // Generate tracking code
            $trackingCode = $this->generateTrackingCode();

            // Create order
            $sql = "INSERT INTO orders (
                customer_name, customer_phone, customer_address, 
                delivery_zone_id, delivery_slot_id, tracking_code, subtotal, delivery_fee, total, 
                status, notes, created_at, updated_at
            ) VALUES (
                :customer_name, :customer_phone, :customer_address,
                :delivery_zone_id, :delivery_slot_id, :tracking_code, :subtotal, :delivery_fee, :total,
                'pending', :notes, NOW(), NOW()
            )";

            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':customer_name' => $data['customer_name'],
                ':customer_phone' => $data['customer_phone'],
                ':customer_address' => $data['customer_address'],
                ':delivery_zone_id' => $data['delivery_zone_id'] ?? null,
                ':delivery_slot_id' => $data['delivery_slot_id'] ?? null,
                ':tracking_code' => $trackingCode,
                ':subtotal' => $data['subtotal'],
                ':delivery_fee' => $data['delivery_fee'],
                ':total' => $data['total'],
                ':notes' => $data['notes'] ?? null,
            ]);

            $orderId = (int) $this->db->lastInsertId();

            // Create order items
            if (!empty($data['items'])) {
                $sql = "INSERT INTO order_items (order_id, product_id, quantity, price) 
                        VALUES (:order_id, :product_id, :quantity, :price)";
                $stmt = $this->db->prepare($sql);

                foreach ($data['items'] as $item) {
                    $stmt->execute([
                        ':order_id' => $orderId,
                        ':product_id' => $item['product_id'],
                        ':quantity' => $item['quantity'],
                        ':price' => $item['price'],
                    ]);
                }
            }

            $this->db->commit();
            return $orderId;

        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /**
     * Update order status
     */
    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->db->prepare("UPDATE orders SET status = :status, updated_at = NOW() WHERE id = :id");
        return $stmt->execute([':id' => $id, ':status' => $status]);
    }

    /**
     * Delete order
     */
    public function delete(int $id): bool
    {
        $this->db->beginTransaction();

        try {
            // Delete order items first
            $stmt = $this->db->prepare("DELETE FROM order_items WHERE order_id = :order_id");
            $stmt->execute([':order_id' => $id]);

            // Delete order
            $stmt = $this->db->prepare("DELETE FROM orders WHERE id = :id");
            $stmt->execute([':id' => $id]);

            $this->db->commit();
            return true;

        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /**
     * Get order by tracking code
     */
    public function getByTrackingCode(string $code): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM orders WHERE tracking_code = :code");
        $stmt->execute([':code' => $code]);

        $order = $stmt->fetch();
        if (!$order) {
            return null;
        }

        // Get order items
        $stmt = $this->db->prepare("
            SELECT oi.*, p.name as product_name, p.image_url 
            FROM order_items oi 
            LEFT JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = :order_id
        ");
        $stmt->execute([':order_id' => $order['id']]);
        $order['items'] = $stmt->fetchAll();

        return $order;
    }

    /**
     * Deduct stock for order items
     */
    public function deductStock(int $orderId): void
    {
        $stmt = $this->db->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = :order_id");
        $stmt->execute([':order_id' => $orderId]);
        $items = $stmt->fetchAll();

        $updateStmt = $this->db->prepare("UPDATE products SET stock = stock - :quantity WHERE id = :id");

        foreach ($items as $item) {
            $updateStmt->execute([
                ':quantity' => $item['quantity'],
                ':id' => $item['product_id']
            ]);
        }
    }

    /**
     * Restore stock for order items
     */
    public function restoreStock(int $orderId): void
    {
        $stmt = $this->db->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = :order_id");
        $stmt->execute([':order_id' => $orderId]);
        $items = $stmt->fetchAll();

        $updateStmt = $this->db->prepare("UPDATE products SET stock = stock + :quantity WHERE id = :id");

        foreach ($items as $item) {
            $updateStmt->execute([
                ':quantity' => $item['quantity'],
                ':id' => $item['product_id']
            ]);
        }
    }

    /**
     * Generate a unique tracking code
     */
    private function generateTrackingCode(): string
    {
        // Format: ZAR-YYYYMMDD-RANDOM (e.g., ZAR-20251202-ABC123)
        $date = date('Ymd');
        $random = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));

        $trackingCode = "ZAR-{$date}-{$random}";

        // Ensure uniqueness
        $stmt = $this->db->prepare("SELECT id FROM orders WHERE tracking_code = :code");
        $stmt->execute([':code' => $trackingCode]);

        if ($stmt->fetch()) {
            // If collision (extremely rare), recursively generate new code
            return $this->generateTrackingCode();
        }

        return $trackingCode;
    }
}
