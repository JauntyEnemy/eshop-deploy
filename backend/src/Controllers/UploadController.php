<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Services\ResponseService;

class UploadController
{
    private $uploadDir;

    public function __construct()
    {
        $this->uploadDir = __DIR__ . '/../../public/uploads';
        
        // Create uploads directory if it doesn't exist
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    /**
     * Upload image file
     */
    public function uploadImage(Request $request, Response $response): Response
    {
        try {
            error_log('Upload Request received');
            error_log('Request headers: ' . json_encode($request->getHeaders()));
            
            $uploadedFiles = $request->getUploadedFiles();
            error_log('Uploaded files: ' . json_encode(array_keys($uploadedFiles)));

            // Check if file was uploaded
            if (empty($uploadedFiles['image'])) {
                error_log('No image file in uploadedFiles');
                return ResponseService::error($response, 'No image file provided', 400);
            }

            $imageFile = $uploadedFiles['image'];
            error_log('Image file received: ' . $imageFile->getClientFilename());
            error_log('Image size: ' . $imageFile->getSize());
            error_log('Image mime: ' . $imageFile->getClientMediaType());

            // Validate file
            $validationResult = $this->validateImage($imageFile);
            if ($validationResult !== true) {
                error_log('Validation failed: ' . $validationResult);
                return ResponseService::error($response, $validationResult, 400);
            }

            // Generate unique filename
            $filename = $this->generateFilename($imageFile);
            $filepath = $this->uploadDir . '/' . $filename;

            error_log('Saving to: ' . $filepath);

            // Save file
            $imageFile->moveTo($filepath);
            
            if (!file_exists($filepath)) {
                error_log('File was not saved!');
                return ResponseService::error($response, 'Failed to save image file', 500);
            }

            error_log('File saved successfully: ' . $filepath);

            // Return relative URL
            $imageUrl = '/uploads/' . $filename;

            return ResponseService::success($response, [
                'url' => $imageUrl,
                'filename' => $filename,
                'message' => 'Image uploaded successfully'
            ]);
        } catch (\Exception $e) {
            error_log('Upload exception: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            return ResponseService::error($response, 'Failed to upload image: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Validate uploaded image
     */
    private function validateImage($file): bool|string
    {
        // Check file size (max 5MB)
        if ($file->getSize() > 5 * 1024 * 1024) {
            return 'Image size must not exceed 5MB';
        }

        // Check file type
        $mimeType = $file->getClientMediaType();
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!in_array($mimeType, $allowedTypes)) {
            return 'Only JPEG, PNG, GIF, and WebP images are allowed';
        }

        return true;
    }

    /**
     * Generate unique filename
     */
    private function generateFilename($file): string
    {
        $ext = pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);
        $name = pathinfo($file->getClientFilename(), PATHINFO_FILENAME);
        
        // Sanitize filename
        $name = preg_replace('/[^a-zA-Z0-9_-]/', '_', $name);
        
        // Add timestamp to ensure uniqueness
        return $name . '_' . time() . '.' . $ext;
    }
}
