package com.unshackled.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a user attempts to perform an action that requires a premium subscription.
 * Maps to HTTP 402 Payment Required.
 */
@ResponseStatus(HttpStatus.PAYMENT_REQUIRED)
public class PremiumRequiredException extends RuntimeException {
    public PremiumRequiredException(String message) {
        super(message);
    }
}
