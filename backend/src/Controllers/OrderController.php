<?php

namespace App\Controllers;

use App\Models\Order;
use App\Services\ResponseService;
use App\Services\SMSService;
use App\Helpers\Validator;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class OrderController
{
    private $orderModel;
    private $smsService;

    public function __construct(Order $orderModel, SMSService $smsService)
    {
        $this->orderModel = $orderModel;
        $this->smsService = $smsService;
    }

    /**
     * Get all orders
     */
    public function index(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $filters = [
            'status' => $params['status'] ?? null,
            'customer_phone' => $params['customer_phone'] ?? null,
        ];

        $orders = $this->orderModel->getAll($filters);
        return ResponseService::success($response, $orders);
    }

    /**
     * Get single order
     */
    public function show(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $order = $this->orderModel->getById($id);

        if (!$order) {
            return ResponseService::error($response, 'Order not found', 404);
        }

        return ResponseService::success($response, $order);
    }

    /**
     * Create new order
     */
    public function store(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        // Validate
        $validator = new Validator();
        $validator
            ->required('customer_name', $data['customer_name'] ?? null)
            ->required('customer_phone', $data['customer_phone'] ?? null)
            ->phone('customer_phone', $data['customer_phone'] ?? null)
            ->required('customer_address', $data['customer_address'] ?? null)
            ->required('delivery_zone_id', $data['delivery_zone_id'] ?? null)
            ->required('delivery_slot_id', $data['delivery_slot_id'] ?? null)
            ->required('items', $data['items'] ?? null);

        if ($validator->fails()) {
            return ResponseService::error($response, 'Validation failed', 422, $validator->getErrors());
        }

        if (empty($data['items']) || !is_array($data['items'])) {
            return ResponseService::error($response, 'Order must contain at least one item', 422);
        }

        try {
            $orderId = $this->orderModel->create($data);
            $order = $this->orderModel->getById($orderId);

            // Send SMS confirmation
            $orderNumber = str_pad($orderId, 6, '0', STR_PAD_LEFT);
            $this->smsService->sendOrderConfirmation($data['customer_phone'], $orderNumber);

            return ResponseService::success($response, $order, 'Order created successfully', 201);
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to create order: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $data = $request->getParsedBody();

        $order = $this->orderModel->getById($id);
        if (!$order) {
            return ResponseService::error($response, 'Order not found', 404);
        }

        $validator = new Validator();
        $validator->required('status', $data['status'] ?? null);

        if ($validator->fails()) {
            return ResponseService::error($response, 'Validation failed', 422, $validator->getErrors());
        }

        $allowedStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!in_array($data['status'], $allowedStatuses)) {
            return ResponseService::error($response, 'Invalid status', 422);
        }

        try {
            $this->orderModel->updateStatus($id, $data['status']);

            // Send SMS notification for certain status changes
            if ($data['status'] === 'out_for_delivery' && !empty($order['customer_phone'])) {
                $this->smsService->sendDeliveryNotification($order['customer_phone'], '30-45 دقيقة');
            }

            $updatedOrder = $this->orderModel->getById($id);
            return ResponseService::success($response, $updatedOrder, 'Order status updated successfully');
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to update order: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete order
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];

        if (!$this->orderModel->getById($id)) {
            return ResponseService::error($response, 'Order not found', 404);
        }

        try {
            $this->orderModel->delete($id);
            return ResponseService::success($response, null, 'Order deleted successfully');
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to delete order: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Track order by tracking code
     */
    public function trackOrder(Request $request, Response $response, array $args): Response
    {
        $trackingCode = $args['trackingCode'];

        $order = $this->orderModel->getByTrackingCode($trackingCode);

        if (!$order) {
            return ResponseService::error($response, 'Order not found', 404);
        }

        return ResponseService::success($response, $order);
    }
}
