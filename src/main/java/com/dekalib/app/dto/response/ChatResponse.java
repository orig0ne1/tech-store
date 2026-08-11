package com.dekalib.app.dto.response;

import com.dekalib.app.entity.ChatStatus;

import java.time.Instant;

public record ChatResponse(
        String id,
        String name,
        String email,
        ChatStatus status,
        Instant createdAt
) {}
