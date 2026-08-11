package com.dekalib.app.dto.response;

public record CategoryResponse(
        long id,
        String name,
        String slug,
        String image
) {}
