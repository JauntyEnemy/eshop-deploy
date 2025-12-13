<?php

namespace App\Controllers;

use App\Models\Category;
use App\Services\ResponseService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class CategoryController
{
    private $categoryModel;

    public function __construct(Category $categoryModel)
    {
        $this->categoryModel = $categoryModel;
    }

    public function index(Request $request, Response $response): Response
    {
        $categories = $this->categoryModel->getAll();
        return ResponseService::success($response, $categories);
    }

    public function store(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $name = $data['name'] ?? null;

        if (!$name) {
            return ResponseService::error($response, 'Category name is required', 422);
        }

        try {
            $id = $this->categoryModel->create($name);
            return ResponseService::success($response, ['id' => $id, 'name' => $name], 'Category created', 201);
        } catch (\PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                return ResponseService::error($response, 'Category already exists', 409);
            }
            return ResponseService::error($response, 'Failed to create category', 500);
        }
    }
}
