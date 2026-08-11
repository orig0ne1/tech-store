package com.dekalib.app.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateChatRequest(
        @NotBlank String name,
        @NotBlank @Email String email
) {}
