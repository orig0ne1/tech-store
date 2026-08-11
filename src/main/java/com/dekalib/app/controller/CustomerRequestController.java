package com.dekalib.app.controller;

import com.dekalib.app.dto.request.CreateCustomerRequest;
import com.dekalib.app.dto.response.CustomerRequestResponse;
import com.dekalib.app.service.CustomerRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/requests")
public class CustomerRequestController {
    private final CustomerRequestService customerRequestService;

    @Autowired
    public CustomerRequestController(CustomerRequestService customerRequestService) {
        this.customerRequestService = customerRequestService;
    }

    @PostMapping
    public CustomerRequestResponse create(@Valid @RequestBody CreateCustomerRequest request) {
        return customerRequestService.create(request);
    }
}
