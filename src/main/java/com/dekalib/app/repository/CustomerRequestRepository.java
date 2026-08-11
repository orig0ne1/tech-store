package com.dekalib.app.repository;

import com.dekalib.app.entity.CustomerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRequestRepository extends JpaRepository<CustomerRequest, Long> {
}
