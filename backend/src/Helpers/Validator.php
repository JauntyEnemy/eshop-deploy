<?php

namespace App\Helpers;

class Validator
{
    private $errors = [];

    /**
     * Validate required field
     */
    public function required($field, $value, $fieldName = null): self
    {
        if (empty($value) && $value !== '0' && $value !== 0) {
            $this->errors[$field] = ($fieldName ?? $field) . ' is required';
        }
        return $this;
    }

    /**
     * Validate email format
     */
    public function email($field, $value): self
    {
        if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = 'Invalid email format';
        }
        return $this;
    }

    /**
     * Validate minimum length
     */
    public function minLength($field, $value, $min, $fieldName = null): self
    {
        if (!empty($value) && strlen($value) < $min) {
            $this->errors[$field] = ($fieldName ?? $field) . " must be at least {$min} characters";
        }
        return $this;
    }

    /**
     * Validate maximum length
     */
    public function maxLength($field, $value, $max, $fieldName = null): self
    {
        if (!empty($value) && strlen($value) > $max) {
            $this->errors[$field] = ($fieldName ?? $field) . " must not exceed {$max} characters";
        }
        return $this;
    }

    /**
     * Validate numeric value
     */
    public function numeric($field, $value): self
    {
        if (!empty($value) && !is_numeric($value)) {
            $this->errors[$field] = 'Must be a number';
        }
        return $this;
    }

    /**
     * Validate phone number (international format)
     */
    public function phone($field, $value): self
    {
        if (!empty($value)) {
            // Accept international phone numbers and UAE numbers
            // Pattern: +XXX XXXX XXXX or 0XX XXXX XXXX or similar
            if (!preg_match('/^[0-9+\-\s()]{7,}$/', $value)) {
                $this->errors[$field] = 'Invalid phone number format';
            }
        }
        return $this;
    }

    /**
     * Check if validation passed
     */
    public function passes(): bool
    {
        return empty($this->errors);
    }

    /**
     * Check if validation failed
     */
    public function fails(): bool
    {
        return !$this->passes();
    }

    /**
     * Get validation errors
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Add custom error
     */
    public function addError($field, $message): self
    {
        $this->errors[$field] = $message;
        return $this;
    }
}
