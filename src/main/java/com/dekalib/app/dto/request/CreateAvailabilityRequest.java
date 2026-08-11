package com.dekalib.app.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAvailabilityRequest(
        @NotNull Long productId,
        @NotBlank String name,
        @NotBlank @Email String email,
        String phone
) {}
