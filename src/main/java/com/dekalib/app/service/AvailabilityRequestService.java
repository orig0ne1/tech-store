package com.dekalib.app.service;

import com.dekalib.app.dto.request.CreateAvailabilityRequest;
import com.dekalib.app.dto.response.AvailabilityRequestResponse;
import com.dekalib.app.entity.AvailabilityRequest;
import com.dekalib.app.entity.Product;
import com.dekalib.app.entity.RequestStatus;
import com.dekalib.app.exception.NotFoundException;
import com.dekalib.app.repository.AvailabilityRequestRepository;
import com.dekalib.app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AvailabilityRequestService {
    private final AvailabilityRequestRepository availabilityRequestRepository;
    private final ProductRepository productRepository;

    @Autowired
    public AvailabilityRequestService(
            AvailabilityRequestRepository availabilityRequestRepository,
            ProductRepository productRepository
    ) {
        this.availabilityRequestRepository = availabilityRequestRepository;
        this.productRepository = productRepository;
    }

    public AvailabilityRequestResponse create(CreateAvailabilityRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NotFoundException("PRODUCT_NOT_FOUND", "Product not found"));

        AvailabilityRequest availabilityRequest = new AvailabilityRequest();
        availabilityRequest.setProduct(product);
        availabilityRequest.setName(request.name());
        availabilityRequest.setEmail(request.email());
        availabilityRequest.setPhone(request.phone());
        availabilityRequest.setStatus(RequestStatus.CREATED);

        AvailabilityRequest saved = availabilityRequestRepository.save(availabilityRequest);
        return new AvailabilityRequestResponse(saved.getId(), saved.getStatus());
    }
}
