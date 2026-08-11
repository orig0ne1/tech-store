package com.dekalib.app.dto.response;

public record ProductSummaryResponse(
        long id,
        String name,
        String slug,
        String description,
        long price,
        String currency,
        String image,
        boolean available
) {}
