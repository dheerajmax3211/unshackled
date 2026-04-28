package com.unshackled.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for the authentication proxy endpoint.
 */
public record LoginRequest(
    @NotBlank(message = "Email is required") 
    @Email(message = "Invalid email format") 
    String email,

    @NotBlank(message = "Password is required") 
    String password
) {}
