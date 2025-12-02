<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class CorsMiddleware
{
    private $settings;

    public function __construct(array $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $response = $handler->handle($request);

        $origin = $request->getHeaderLine('Origin');
        $allowedOrigins = $this->settings['cors']['origin'];

        // Check if origin is allowed
        if (in_array($origin, $allowedOrigins) || in_array('*', $allowedOrigins)) {
            $response = $response
                ->withHeader('Access-Control-Allow-Origin', $origin)
                ->withHeader('Access-Control-Allow-Credentials', 'true')
                ->withHeader('Access-Control-Allow-Headers', implode(', ', $this->settings['cors']['headers']))
                ->withHeader('Access-Control-Allow-Methods', implode(', ', $this->settings['cors']['methods']));
        }

        return $response;
    }
}
