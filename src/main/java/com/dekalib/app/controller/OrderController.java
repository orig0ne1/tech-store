package com.dekalib.app.controller;

import com.dekalib.app.dto.request.CreateOrderRequest;
import com.dekalib.app.dto.response.OrderResponse;
import com.dekalib.app.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.create(request);
    }

    @GetMapping("/{id}")
    public OrderResponse getById(@PathVariable long id) {
        return orderService.getById(id);
    }

    @PostMapping("/{id}/cancel")
    public OrderResponse cancel(@PathVariable long id) {
        return orderService.cancel(id);
    }
}
