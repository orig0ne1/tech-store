package com.dekalib.app.dto.response;

import com.dekalib.app.entity.ChatSender;

import java.time.Instant;

public record ChatMessageResponse(
        long id,
        ChatSender sender,
        String text,
        Instant createdAt
) {}
