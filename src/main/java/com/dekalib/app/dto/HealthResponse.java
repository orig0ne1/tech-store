package com.dekalib.app.dto;

import java.time.Instant;

public record HealthResponse (
        String status,
        Instant timestamp
) {}
