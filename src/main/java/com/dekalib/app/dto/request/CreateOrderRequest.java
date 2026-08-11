package com.dekalib.app.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateOrderRequest(
        @NotNull @Valid Customer customer,
        @NotEmpty List<@Valid Item> items,
        String comment
) {
    public record Customer(
            @NotBlank String name,
            @NotBlank @Email String email,
            String phone
    ) {}

    public record Item(
            @NotNull Long productId,
            @NotNull @Min(1) Integer quantity
    ) {}
}
