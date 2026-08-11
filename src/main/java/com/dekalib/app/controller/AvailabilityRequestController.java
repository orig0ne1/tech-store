package com.dekalib.app.controller;

import com.dekalib.app.dto.request.CreateAvailabilityRequest;
import com.dekalib.app.dto.response.AvailabilityRequestResponse;
import com.dekalib.app.service.AvailabilityRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/availability-requests")
public class AvailabilityRequestController {
    private final AvailabilityRequestService availabilityRequestService;

    @Autowired
    public AvailabilityRequestController(AvailabilityRequestService availabilityRequestService) {
        this.availabilityRequestService = availabilityRequestService;
    }

    @PostMapping
    public AvailabilityRequestResponse create(@Valid @RequestBody CreateAvailabilityRequest request) {
        return availabilityRequestService.create(request);
    }
}
