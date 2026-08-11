package com.dekalib.app.service;

import com.dekalib.app.dto.request.CreateCustomerRequest;
import com.dekalib.app.dto.response.CustomerRequestResponse;
import com.dekalib.app.entity.CustomerRequest;
import com.dekalib.app.entity.RequestStatus;
import com.dekalib.app.repository.CustomerRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerRequestService {
    private final CustomerRequestRepository customerRequestRepository;

    @Autowired
    public CustomerRequestService(CustomerRequestRepository customerRequestRepository) {
        this.customerRequestRepository = customerRequestRepository;
    }

    public CustomerRequestResponse create(CreateCustomerRequest request) {
        CustomerRequest customerRequest = new CustomerRequest();
        customerRequest.setName(request.name());
        customerRequest.setEmail(request.email());
        customerRequest.setPhone(request.phone());
        customerRequest.setMessage(request.message());
        customerRequest.setStatus(RequestStatus.CREATED);

        CustomerRequest saved = customerRequestRepository.save(customerRequest);
        return new CustomerRequestResponse(saved.getId(), saved.getStatus());
    }
}
