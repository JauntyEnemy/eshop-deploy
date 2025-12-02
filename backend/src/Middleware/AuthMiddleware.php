<?php

namespace App\Middleware;

use App\Services\AuthService;
use App\Services\ResponseService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class AuthMiddleware
{
    private $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (empty($authHeader)) {
            $response = new \Slim\Psr7\Response();
            return ResponseService::error($response, 'Authorization header missing', 401);
        }

        // Extract token from "Bearer <token>"
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
        } else {
            $response = new \Slim\Psr7\Response();
            return ResponseService::error($response, 'Invalid authorization header format', 401);
        }

        $payload = $this->authService->verifyToken($token);

        if ($payload === null) {
            $response = new \Slim\Psr7\Response();
            return ResponseService::error($response, 'Invalid or expired token', 401);
        }

        // Add user info to request attributes
        $request = $request->withAttribute('user', $payload);

        return $handler->handle($request);
    }
}
