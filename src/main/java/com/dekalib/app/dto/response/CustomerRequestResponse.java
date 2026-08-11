package com.dekalib.app.dto.response;

import com.dekalib.app.entity.RequestStatus;

public record CustomerRequestResponse(
        long id,
        RequestStatus status
) {}
