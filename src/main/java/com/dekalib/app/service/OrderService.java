package com.dekalib.app.service;

import com.dekalib.app.dto.request.CreateOrderRequest;
import com.dekalib.app.dto.response.OrderResponse;
import com.dekalib.app.entity.Order;
import com.dekalib.app.entity.OrderItem;
import com.dekalib.app.entity.OrderStatus;
import com.dekalib.app.entity.Product;
import com.dekalib.app.exception.ConflictException;
import com.dekalib.app.exception.NotFoundException;
import com.dekalib.app.repository.OrderRepository;
import com.dekalib.app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        Order order = new Order();
        order.setNumber("ORD-" + System.currentTimeMillis());
        order.setCustomerName(request.customer().name());
        order.setCustomerEmail(request.customer().email());
        order.setCustomerPhone(request.customer().phone());
        order.setComment(request.comment());
        order.setStatus(OrderStatus.CREATED);

        long total = 0;
        for (CreateOrderRequest.Item item : request.items()) {
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new NotFoundException(
                            "PRODUCT_NOT_FOUND",
                            "Product not found: " + item.productId()
                    ));
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(item.quantity());
            orderItem.setPrice(product.getPrice());
            order.addItem(orderItem);
            total += product.getPrice() * item.quantity();
        }
        order.setTotal(total);

        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public OrderResponse getById(long id) {
        return toResponse(getOrderById(id));
    }

    @Transactional
    public OrderResponse cancel(long id) {
        Order order = getOrderById(id);
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new ConflictException("ORDER_ALREADY_CANCELLED", "Order is already cancelled");
        }
        order.setStatus(OrderStatus.CANCELLED);
        return toResponse(order);
    }

    private Order getOrderById(long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("ORDER_NOT_FOUND", "Order not found"));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderResponse.OrderItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .toList();
        return new OrderResponse(
                order.getId(),
                order.getNumber(),
                order.getStatus(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                order.getComment(),
                order.getTotal(),
                order.getCreatedAt(),
                items
        );
    }
}
