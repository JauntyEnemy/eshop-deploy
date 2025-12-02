<?php

namespace App\Controllers;

use App\Models\Product;
use App\Services\ResponseService;
use App\Helpers\Validator;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ProductController
{
    private $productModel;

    public function __construct(Product $productModel)
    {
        $this->productModel = $productModel;
    }

    /**
     * Get all products
     */
    public function index(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $filters = [
            'category' => $params['category'] ?? null,
            'search' => $params['search'] ?? null,
            'in_stock' => isset($params['in_stock']) ? (bool) $params['in_stock'] : false,
        ];

        $products = $this->productModel->getAll($filters);
        return ResponseService::success($response, $products);
    }

    /**
     * Get single product
     */
    public function show(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $product = $this->productModel->getById($id);

        if (!$product) {
            return ResponseService::error($response, 'Product not found', 404);
        }

        return ResponseService::success($response, $product);
    }

    /**
     * Create new product
     */
    public function store(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        // Validate
        $validator = new Validator();
        $validator
            ->required('name', $data['name'] ?? null)
            ->required('price', $data['price'] ?? null)
            ->numeric('price', $data['price'] ?? null)
            ->numeric('stock', $data['stock'] ?? null);

        if ($validator->fails()) {
            return ResponseService::error($response, 'Validation failed', 422, $validator->getErrors());
        }

        try {
            $productId = $this->productModel->create($data);
            $product = $this->productModel->getById($productId);

            return ResponseService::success($response, $product, 'Product created successfully', 201);
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to create product: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update product
     */
    public function update(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];
        $data = $request->getParsedBody();

        // Check if product exists
        if (!$this->productModel->getById($id)) {
            return ResponseService::error($response, 'Product not found', 404);
        }

        // Validate - only validate fields that are being updated
        // If updating stock only, don't require name/price
        $validator = new Validator();
        
        if (isset($data['name'])) {
            $validator->required('name', $data['name']);
        }
        if (isset($data['price'])) {
            $validator->required('price', $data['price']);
            $validator->numeric('price', $data['price']);
        }
        if (isset($data['stock'])) {
            $validator->numeric('stock', $data['stock']);
        }

        if ($validator->fails()) {
            return ResponseService::error($response, 'Validation failed', 422, $validator->getErrors());
        }

        try {
            $this->productModel->update($id, $data);
            $product = $this->productModel->getById($id);

            return ResponseService::success($response, $product, 'Product updated successfully');
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to update product: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete product
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];

        if (!$this->productModel->getById($id)) {
            return ResponseService::error($response, 'Product not found', 404);
        }

        try {
            $this->productModel->delete($id);
            return ResponseService::success($response, null, 'Product deleted successfully');
        } catch (\Exception $e) {
            return ResponseService::error($response, 'Failed to delete product: ' . $e->getMessage(), 500);
        }
    }
}
