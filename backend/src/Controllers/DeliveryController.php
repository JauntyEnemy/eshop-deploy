<?php

namespace App\Controllers;

use App\Models\DeliveryZone;
use App\Services\ResponseService;
use App\Helpers\Validator;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class DeliveryController
{
    private $deliveryZoneModel;

    public function __construct(DeliveryZone $deliveryZoneModel)
    {
        $this->deliveryZoneModel = $deliveryZoneModel;
    }

    /**
     * Get all delivery zones
     */
    public function index(Request $request, Response $response): Response
    {
        $zones = $this->deliveryZoneModel->getAll();
        return ResponseService::success($response, $zones);
    }

    /**
     * Get single delivery zone
     */
    public function show(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $zone = $this->deliveryZoneModel->getById($id);

        if (!$zone) {
            return ResponseService::error($response, 'Delivery zone not found', 404);
        }

        return ResponseService::success($response, $zone);
    }

    /**
     * Create new delivery zone
     */
    public function store(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        // Validate
        $validator = new Validator();
        $validator
            ->required('name', $data['name'] ?? null)
            ->required('fee', $data['fee'] ?? null)
            ->numeric('fee', $data['fee'] ?? null);

        if ($validator->fails()) {
            return ResponseService::error($response, 'Validation failed', 422, $validator->getErrors());
        }

        try {
            $zoneId = $this->deliveryZoneModel->create($data);
            $zone = $this->deliveryZoneModel->getById($zoneId);

            return ResponseService::success($response, $zone, 'Delivery zone created successfully', 201);
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to create delivery zone: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update delivery zone
     */
    public function update(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $data = $request->getParsedBody();

        if (!$this->deliveryZoneModel->getById($id)) {
            return ResponseService::error($response, 'Delivery zone not found', 404);
        }

        // Validate
        $validator = new Validator();
        $validator
            ->required('name', $data['name'] ?? null)
            ->required('fee', $data['fee'] ?? null)
            ->numeric('fee', $data['fee'] ?? null);

        if ($validator->fails()) {
            return ResponseService::error($response, 'Validation failed', 422, $validator->getErrors());
        }

        try {
            $this->deliveryZoneModel->update($id, $data);
            $zone = $this->deliveryZoneModel->getById($id);

            return ResponseService::success($response, $zone, 'Delivery zone updated successfully');
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to update delivery zone: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete delivery zone
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];

        if (!$this->deliveryZoneModel->getById($id)) {
            return ResponseService::error($response, 'Delivery zone not found', 404);
        }

        try {
            $this->deliveryZoneModel->delete($id);
            return ResponseService::success($response, null, 'Delivery zone deleted successfully');
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to delete delivery zone: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get delivery slots
     */
    public function getSlots(Request $request, Response $response): Response
    {
        // In a real app, this would come from the database
        // For now, we'll return hardcoded slots as per the schema
        $slots = [
            ['id' => 1, 'label' => 'Morning (9 AM - 12 PM)', 'start_time' => '09:00:00', 'end_time' => '12:00:00', 'is_active' => true],
            ['id' => 2, 'label' => 'Afternoon (12 PM - 3 PM)', 'start_time' => '12:00:00', 'end_time' => '15:00:00', 'is_active' => true],
            ['id' => 3, 'label' => 'Late Afternoon (3 PM - 6 PM)', 'start_time' => '15:00:00', 'end_time' => '18:00:00', 'is_active' => true],
            ['id' => 4, 'label' => 'Evening (6 PM - 9 PM)', 'start_time' => '18:00:00', 'end_time' => '21:00:00', 'is_active' => true],
        ];

        return ResponseService::success($response, $slots);
    }
}
