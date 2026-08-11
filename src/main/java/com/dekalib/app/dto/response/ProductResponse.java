package com.dekalib.app.dto.response;

import java.util.List;
import java.util.Map;

public record ProductResponse(
        long id,
        String name,
        String slug,
        String description,
        long price,
        String currency,
        String image,
        List<String> images,
        Map<String, String> attributes,
        CategoryRefResponse category,
        boolean available
) {}
