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
                'role' => $admin['role'] ?? 1,
            ]);

            return ResponseService::success($response, [
                'token' => $token,
                'admin' => [
                    'id' => $admin['id'],
                    'username' => $admin['username'],
                    'name' => $admin['name'],
                    'role' => (int) ($admin['role'] ?? 1),
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
            $stmt = $this->db->query("SELECT SUM(total) as revenue FROM orders WHERE status = 'delivered'");
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

    /**
     * List all staff
     */
    public function listStaff(Request $request, Response $response): Response
    {
        try {
            $stmt = $this->db->query("SELECT id, username, name, role, created_at FROM admins ORDER BY created_at DESC");
            $staff = $stmt->fetchAll();
            return ResponseService::success($response, $staff);
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to fetch staff', 500);
        }
    }

    /**
     * Create new staff
     */
    public function createStaff(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        $validator = new Validator();
        $validator->required('username', $data['username'] ?? null)
            ->required('password', $data['password'] ?? null)
            ->required('role', $data['role'] ?? null);

        if ($validator->fails()) {
            return ResponseService::error($response, 'Validation failed', 422, $validator->getErrors());
        }

        try {
            // Check username uniqueness
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM admins WHERE username = :username");
            $stmt->execute([':username' => $data['username']]);
            if ($stmt->fetchColumn() > 0) {
                return ResponseService::error($response, 'Username already exists', 409);
            }

            $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
            $role = (int) $data['role'];
            if (!in_array($role, [1, 2, 3])) {
                return ResponseService::error($response, 'Invalid role. 1=Admin, 2=Seller, 3=Driver', 400);
            }

            $sql = "INSERT INTO admins (username, password, name, role) VALUES (:username, :password, :name, :role)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':username' => $data['username'],
                ':password' => $passwordHash,
                ':name' => $data['name'] ?? '',
                ':role' => $role
            ]);

            return ResponseService::success($response, null, 'Staff created successfully', 201);
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to create staff: ' . $e->getMessage(), 500);
        }
    }
}
