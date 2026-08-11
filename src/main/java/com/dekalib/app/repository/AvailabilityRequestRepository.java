package com.dekalib.app.repository;

import com.dekalib.app.entity.AvailabilityRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvailabilityRequestRepository extends JpaRepository<AvailabilityRequest, Long> {
}
