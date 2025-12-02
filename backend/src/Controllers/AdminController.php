<?php

namespace App\Controllers;

use App\Services\AuthService;
use App\Services\ResponseService;
use App\Helpers\Validator;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AdminController
{
    private $authService;
    private $db;

    public function __construct(AuthService $authService, \PDO $db)
    {
        $this->authService = $authService;
        $this->db = $db;
    }

    /**
     * Admin login
     */
    public function login(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        // Validate
        $validator = new Validator();
        $validator
            ->required('username', $data['username'] ?? null)
            ->required('password', $data['password'] ?? null);

        if ($validator->fails()) {
            return ResponseService::error($response, 'Validation failed', 422, $validator->getErrors());
        }

        try {
            // Get admin from database
            $stmt = $this->db->prepare("SELECT * FROM admins WHERE username = :username");
            $stmt->execute([':username' => $data['username']]);
            $admin = $stmt->fetch();

            // Debug logging
            $debugInfo = [
                'username_provided' => $data['username'] ?? 'null',
                'password_provided' => isset($data['password']) ? 'yes' : 'no',
                'admin_found' => !empty($admin),
                'password_hash_exists' => !empty($admin['password'] ?? null),
            ];

            if ($admin) {
                $debugInfo['password_verify_result'] = password_verify($data['password'], $admin['password']) ? 'PASS' : 'FAIL';
            }

            // Log debug info
            error_log(json_encode($debugInfo), 3, __DIR__ . '/../../logs/login_debug.log');

            if (!$admin || !$this->authService->verifyPassword($data['password'], $admin['password'])) {
                return ResponseService::error($response, 'Invalid credentials', 401);
            }

            // Generate JWT token
            $token = $this->authService->generateToken([
                'id' => $admin['id'],
                'username' => $admin['username'],
                'role' => 'admin',
            ]);

            return ResponseService::success($response, [
                'token' => $token,
                'admin' => [
                    'id' => $admin['id'],
                    'username' => $admin['username'],
                    'name' => $admin['name'],
                ],
            ], 'Login successful');

        } catch (\Exception $e) {
            return ResponseService::error($response, 'Login failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get current admin info
     */
    public function me(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');

        if (!$user) {
            return ResponseService::error($response, 'Unauthorized', 401);
        }

        try {
            $stmt = $this->db->prepare("SELECT id, username, name FROM admins WHERE id = :id");
            $stmt->execute([':id' => $user['id']]);
            $admin = $stmt->fetch();

            if (!$admin) {
                return ResponseService::error($response, 'Admin not found', 404);
            }

            return ResponseService::success($response, $admin);

        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to get admin info: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get dashboard statistics
     */
    public function dashboard(Request $request, Response $response): Response
    {
        try {
            // Get total orders
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM orders");
            $totalOrders = $stmt->fetch()['total'];

            // Get pending orders
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM orders WHERE status = 'pending'");
            $pendingOrders = $stmt->fetch()['total'];

            // Get total revenue
            $stmt = $this->db->query("SELECT SUM(total) as revenue FROM orders WHERE status != 'cancelled'");
            $totalRevenue = $stmt->fetch()['revenue'] ?? 0;

            // Get total products
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM products");
            $totalProducts = $stmt->fetch()['total'];

            // Get recent orders
            $stmt = $this->db->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 10");
            $recentOrders = $stmt->fetchAll();

            $stats = [
                'total_orders' => (int) $totalOrders,
                'pending_orders' => (int) $pendingOrders,
                'total_revenue' => (float) $totalRevenue,
                'total_products' => (int) $totalProducts,
                'recent_orders' => $recentOrders,
            ];

            return ResponseService::success($response, $stats);

        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to get dashboard stats: ' . $e->getMessage(), 500);
        }
    }
}
