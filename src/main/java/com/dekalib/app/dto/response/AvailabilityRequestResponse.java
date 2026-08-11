package com.dekalib.app.dto.response;

import com.dekalib.app.entity.RequestStatus;

public record AvailabilityRequestResponse(
        long id,
        RequestStatus status
) {}
