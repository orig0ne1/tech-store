package com.dekalib.app.dto.response;

public record CompanyContactsResponse(
        String email,
        String phone,
        String address,
        WorkingHoursResponse workingHours
) {}
