package com.dekalib.app.dto.response;

import com.dekalib.app.entity.OrderStatus;

import java.time.Instant;
import java.util.List;

public record OrderResponse(
        long id,
        String number,
        OrderStatus status,
        String customerName,
        String customerEmail,
        String customerPhone,
        String comment,
        long total,
        Instant createdAt,
        List<OrderItemResponse> items
) {
    public record OrderItemResponse(
            long id,
            long productId,
            String productName,
            int quantity,
            long price
    ) {}
}
