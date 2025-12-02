<?php

namespace App\Services;

class AuthService
{
    private $jwtSecret;
    private $jwtAlgorithm;
    private $jwtExpiration;

    public function __construct(array $settings)
    {
        $this->jwtSecret = $settings['jwt']['secret'];
        $this->jwtAlgorithm = $settings['jwt']['algorithm'];
        $this->jwtExpiration = $settings['jwt']['expiration'];
    }

    /**
     * Generate JWT token
     */
    public function generateToken(array $payload): string
    {
        $header = json_encode(['typ' => 'JWT', 'alg' => $this->jwtAlgorithm]);
        $payload['exp'] = time() + $this->jwtExpiration;
        $payload = json_encode($payload);

        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode($payload);

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->jwtSecret, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Verify and decode JWT token
     */
    public function verifyToken(string $token): ?array
    {
        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            return null;
        }

        [$base64UrlHeader, $base64UrlPayload, $base64UrlSignature] = $tokenParts;

        $signature = $this->base64UrlDecode($base64UrlSignature);
        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->jwtSecret, true);

        if (!hash_equals($signature, $expectedSignature)) {
            return null;
        }

        $payload = json_decode($this->base64UrlDecode($base64UrlPayload), true);

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null; // Token expired
        }

        return $payload;
    }

    /**
     * Hash password
     */
    public function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    /**
     * Verify password
     */
    public function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    private function base64UrlEncode($data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode($data): string
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
