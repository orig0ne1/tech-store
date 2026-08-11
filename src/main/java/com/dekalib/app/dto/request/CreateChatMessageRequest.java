package com.dekalib.app.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateChatMessageRequest(
        @NotBlank String text
) {}
